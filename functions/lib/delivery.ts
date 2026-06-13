import type { Inquiry } from './inquiry';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function formatMineral(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function createInquiryReference(date: Date, entropy: string): string {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  return `GC-${day}-${entropy.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()}`;
}

export function retentionCutoffIso(now: Date, days: number): string {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  return cutoff.toISOString();
}

export function expiryIso(now: Date, days: number): string {
  const expiry = new Date(now);
  expiry.setUTCDate(expiry.getUTCDate() + days);
  return expiry.toISOString();
}

export function buildInquiryEmail(
  inquiry: Inquiry,
  reference: string,
): { subject: string; html: string; text: string } {
  const rows = [
    ['Reference', reference],
    ['Mineral', formatMineral(inquiry.mineral)],
    ['Capacity', inquiry.capacity],
    ['Country', inquiry.country],
    ['Project stage', inquiry.projectStage],
    ['Ore type', inquiry.oreType || 'Not provided'],
    ['Grade / assay', inquiry.grade || 'Not provided'],
    ['Feed size', inquiry.feedSize || 'Not provided'],
    ['Water / power', inquiry.utilities || 'Not provided'],
    ['Budget', inquiry.budget || 'Not provided'],
    ['Name', inquiry.name],
    ['Company', inquiry.company || 'Not provided'],
    ['Email', inquiry.email],
    ['WhatsApp', inquiry.whatsapp || 'Not provided'],
    ['Project description', inquiry.message],
  ] as const;

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const textRows = rows
    .map(([label, value]) => `${label}: ${stripTags(value)}`)
    .join('\n');

  return {
    subject: `[${reference}] ${formatMineral(inquiry.mineral)} project enquiry`,
    html: `<h1>New Gold Concentrator enquiry</h1><table style="border-collapse:collapse;width:100%">${htmlRows}</table>`,
    text: `New Gold Concentrator enquiry\n\n${textRows}`,
  };
}

export function buildCustomerConfirmation(
  inquiry: Inquiry,
  reference: string,
): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(inquiry.name);
  const subject = `We received your project enquiry - ${reference}`;
  const text = `Hello ${stripTags(inquiry.name)},\n\nWe received your ${formatMineral(inquiry.mineral)} project enquiry. A technical team member will review it within one business day.\n\nSend assays, ore photos or videos by replying to this email and include reference ${reference}.\n\nGold Concentrator`;
  const html = `<p>Hello ${safeName},</p><p>We received your ${escapeHtml(formatMineral(inquiry.mineral))} project enquiry. A technical team member will review it within one business day.</p><p>Send assays, ore photos or videos by replying to this email and include reference <strong>${escapeHtml(reference)}</strong>.</p><p>Gold Concentrator</p>`;
  return { subject, html, text };
}
