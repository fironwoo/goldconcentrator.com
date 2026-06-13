export const MINERALS = [
  'alluvial_gold',
  'hard_rock_gold',
  'tin',
  'tungsten',
  'chrome',
  'other',
] as const;

export type Mineral = (typeof MINERALS)[number];

export type Inquiry = {
  mineral: Mineral;
  capacity: string;
  oreType: string;
  grade: string;
  feedSize: string;
  utilities: string;
  country: string;
  projectStage: string;
  budget: string;
  message: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  consent: true;
  turnstileToken: string;
};

type ParseResult =
  | { ok: true; value: Inquiry }
  | { ok: false; errors: string[] };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseInquiry(input: unknown): ParseResult {
  const data =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : {};
  const errors: string[] = [];
  const mineral = text(data.mineral);
  const email = text(data.email).toLowerCase();

  if (!MINERALS.includes(mineral as Mineral)) {
    errors.push('Select a supported mineral.');
  }
  if (!text(data.capacity)) errors.push('Enter the target capacity.');
  if (!text(data.country)) errors.push('Enter the project country.');
  if (!text(data.projectStage)) errors.push('Select the project stage.');
  if (!text(data.message)) errors.push('Tell us about the project.');
  if (text(data.message).length > 5000) {
    errors.push('Project description must be 5,000 characters or fewer.');
  }
  if (!text(data.name)) errors.push('Enter your name.');
  if (!emailPattern.test(email)) errors.push('Enter a valid email address.');
  if (data.consent !== true) errors.push('Privacy consent is required.');
  if (!text(data.turnstileToken)) {
    errors.push('Please complete the anti-spam check.');
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      mineral: mineral as Mineral,
      capacity: text(data.capacity),
      oreType: text(data.oreType),
      grade: text(data.grade),
      feedSize: text(data.feedSize),
      utilities: text(data.utilities),
      country: text(data.country),
      projectStage: text(data.projectStage),
      budget: text(data.budget),
      message: text(data.message),
      name: text(data.name),
      company: text(data.company),
      email,
      whatsapp: text(data.whatsapp),
      consent: true,
      turnstileToken: text(data.turnstileToken),
    },
  };
}

export function shouldRateLimit(input: {
  recentSubmissions: number;
  maxSubmissions: number;
}): boolean {
  return input.recentSubmissions >= input.maxSubmissions;
}
