import {
  buildCustomerConfirmation,
  buildInquiryEmail,
  createInquiryReference,
  expiryIso,
} from '../lib/delivery';
import { parseInquiry, shouldRateLimit } from '../lib/inquiry';

interface Env {
  DB: D1DatabaseLike;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  INQUIRY_FROM_EMAIL: string;
  INQUIRY_TO_EMAIL: string;
  IP_HASH_SALT: string;
}

interface D1StatementLike {
  bind(...values: unknown[]): D1StatementLike;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1DatabaseLike {
  prepare(query: string): D1StatementLike;
}

interface PagesContextLike {
  request: Request;
  env: Env;
}

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string,
): Promise<boolean> {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as TurnstileResponse;
  return result.success;
}

async function sendEmail(
  apiKey: string,
  input: {
    from: string;
    to: string[];
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
  },
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email provider returned ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export const onRequestPost = async (context: PagesContextLike): Promise<Response> => {
  const contentLength = Number(context.request.headers.get('content-length') || 0);
  if (contentLength > 60_000) {
    return json({ message: 'Submission is too large.' }, 413);
  }

  let raw: unknown;
  try {
    raw = await context.request.json();
  } catch {
    return json({ message: 'Send a valid JSON request.' }, 400);
  }

  const parsed = parseInquiry(raw);
  if (!parsed.ok) return json({ errors: parsed.errors }, 400);

  const remoteIp = context.request.headers.get('CF-Connecting-IP') || '';
  const ipHash = await hashIp(remoteIp || 'unknown', context.env.IP_HASH_SALT);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const rateResult = await context.env.DB.prepare(
    'SELECT COUNT(*) AS count FROM inquiries WHERE ip_hash = ? AND received_at >= ?',
  )
    .bind(ipHash, fifteenMinutesAgo)
    .first<{ count: number }>();

  if (
    shouldRateLimit({
      recentSubmissions: Number(rateResult?.count || 0),
      maxSubmissions: 3,
    })
  ) {
    return json(
      { message: 'Too many recent submissions. Please wait before trying again.' },
      429,
    );
  }

  const turnstileValid = await verifyTurnstile(
    parsed.value.turnstileToken,
    context.env.TURNSTILE_SECRET_KEY,
    remoteIp,
  );
  if (!turnstileValid) {
    return json({ message: 'The anti-spam check could not be verified.' }, 400);
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const reference = createInquiryReference(now, id);
  const inquiry = parsed.value;

  await context.env.DB.prepare(
    `INSERT INTO inquiries (
      id, reference, received_at, expires_at, ip_hash, mineral, capacity, ore_type,
      grade, feed_size, utilities, country, project_stage, budget, message, name,
      company, email, whatsapp, email_sent, delivery_error
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)`,
  )
    .bind(
      id,
      reference,
      now.toISOString(),
      expiryIso(now, 180),
      ipHash,
      inquiry.mineral,
      inquiry.capacity,
      inquiry.oreType,
      inquiry.grade,
      inquiry.feedSize,
      inquiry.utilities,
      inquiry.country,
      inquiry.projectStage,
      inquiry.budget,
      inquiry.message,
      inquiry.name,
      inquiry.company,
      inquiry.email,
      inquiry.whatsapp,
    )
    .run();

  const internal = buildInquiryEmail(inquiry, reference);
  const customer = buildCustomerConfirmation(inquiry, reference);
  const results = await Promise.allSettled([
    sendEmail(context.env.RESEND_API_KEY, {
      from: context.env.INQUIRY_FROM_EMAIL,
      to: [context.env.INQUIRY_TO_EMAIL],
      replyTo: inquiry.email,
      ...internal,
    }),
    sendEmail(context.env.RESEND_API_KEY, {
      from: context.env.INQUIRY_FROM_EMAIL,
      to: [inquiry.email],
      replyTo: context.env.INQUIRY_TO_EMAIL,
      ...customer,
    }),
  ]);

  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) =>
      result.reason instanceof Error ? result.reason.message : 'Unknown delivery error',
    );

  await context.env.DB.prepare(
    'UPDATE inquiries SET email_sent = ?, delivery_error = ? WHERE id = ?',
  )
    .bind(errors.length === 0 ? 1 : 0, errors.length ? errors.join(' | ') : null, id)
    .run();

  return json(
    {
      ok: true,
      reference,
      message:
        errors.length === 0
          ? 'Project received.'
          : 'Project received and safely stored. Email delivery will be retried manually.',
    },
    201,
  );
};

export const onRequest = async (context: PagesContextLike): Promise<Response> => {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
};
