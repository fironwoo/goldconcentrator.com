import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from './inquiry';

const validInquiry = {
  mineral: 'alluvial_gold',
  capacity: '20 TPH',
  oreType: 'Free-washing alluvial material',
  grade: 'Unknown',
  feedSize: 'Below 80 mm',
  utilities: 'Water available',
  country: 'Test Country',
  projectStage: 'planning',
  budget: '',
  message: 'Automated launch test for the inquiry delivery path.',
  name: 'Launch Test',
  company: 'Test only',
  email: 'launch-test@example.com',
  whatsapp: '',
  consent: true,
  turnstileToken: 'verified-test-token',
};

function createDatabase(events: string[]) {
  const statements: Array<{ query: string; values: unknown[] }> = [];

  return {
    statements,
    prepare(query: string) {
      const statement = { query, values: [] as unknown[] };
      statements.push(statement);

      return {
        bind(...values: unknown[]) {
          statement.values = values;
          return this;
        },
        async first<T>() {
          events.push('database:rate-limit');
          return { count: 0 } as T;
        },
        async run() {
          events.push(query.includes('INSERT INTO') ? 'database:insert' : 'database:update');
          return { success: true };
        },
      };
    },
  };
}

function createContext(database: ReturnType<typeof createDatabase>) {
  return {
    request: new Request('https://example.com/api/inquiry', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'CF-Connecting-IP': '203.0.113.10',
      },
      body: JSON.stringify(validInquiry),
    }),
    env: {
      DB: database,
      TURNSTILE_SECRET_KEY: 'turnstile-secret',
      RESEND_API_KEY: 'resend-key',
      INQUIRY_FROM_EMAIL: 'website@example.com',
      INQUIRY_TO_EMAIL: 'inquiry@example.com',
      IP_HASH_SALT: 'test-salt',
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('inquiry API delivery guarantees', () => {
  it('stores the inquiry before sending mail and marks successful delivery', async () => {
    const events: string[] = [];
    const database = createDatabase(events);
    let emailRequests = 0;

    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('turnstile')) return Response.json({ success: true });

      emailRequests += 1;
      events.push('email:send');
      return Response.json({ id: `email-${emailRequests}` });
    }));

    const response = await onRequestPost(createContext(database));
    const body = await response.json() as { ok: boolean; message: string };

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.message).toBe('Project received.');
    expect(emailRequests).toBe(2);
    expect(events.indexOf('database:insert')).toBeLessThan(events.indexOf('email:send'));
    expect(events.at(-1)).toBe('database:update');

    const update = database.statements.find(({ query }) => query.startsWith('UPDATE inquiries'));
    expect(update?.values[0]).toBe(1);
    expect(update?.values[1]).toBeNull();
  });

  it('keeps the stored inquiry when email delivery fails', async () => {
    const events: string[] = [];
    const database = createDatabase(events);

    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('turnstile')) return Response.json({ success: true });

      events.push('email:failed');
      return new Response('Temporary provider failure', { status: 503 });
    }));

    const response = await onRequestPost(createContext(database));
    const body = await response.json() as { ok: boolean; message: string };

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.message).toMatch(/safely stored/i);
    expect(events).toContain('database:insert');
    expect(events.at(-1)).toBe('database:update');

    const update = database.statements.find(({ query }) => query.startsWith('UPDATE inquiries'));
    expect(update?.values[0]).toBe(0);
    expect(String(update?.values[1])).toContain('Email provider returned 503');
  });
});
