import siteData from '../data/site.json';

export const SITE = siteData;

export type SolutionCard = {
  slug: string;
  name: string;
  category: 'gold' | 'mineral' | 'more';
  summary: string;
};

const homepageSolutionCards: SolutionCard[] = [
  {
    slug: 'alluvial-gold',
    name: 'Alluvial Gold',
    category: 'gold',
    summary:
      'Washing, sizing and staged gravity recovery for free-washing or clay-rich placer material.',
  },
  {
    slug: 'hard-rock-gold',
    name: 'Hard Rock Gold',
    category: 'gold',
    summary:
      'Crushing, grinding and test-led recovery routes built around liberation and mineralogy.',
  },
  {
    slug: 'tin',
    name: 'Tin',
    category: 'mineral',
    summary:
      'Gravity circuits designed around cassiterite liberation, slime control and staged recovery.',
  },
  {
    slug: 'tungsten',
    name: 'Tungsten',
    category: 'mineral',
    summary:
      'Process routes for coarse and fine scheelite or wolframite recovery with controlled classification.',
  },
  {
    slug: 'chrome',
    name: 'Chrome',
    category: 'mineral',
    summary:
      'Washing, classification and gravity separation for chromite-bearing ore and tailings.',
  },
  {
    slug: 'more-minerals',
    name: 'More',
    category: 'more',
    summary:
      'Gravity concentration assessments for tantalum-niobium, manganese, ilmenite, zircon and other dense minerals.',
  },
];

export function getHomepageSolutionCards(): SolutionCard[] {
  return homepageSolutionCards.map((item) => ({ ...item }));
}

export function buildCanonicalUrl(pathname: string): string {
  const normalizedPath = `/${pathname}`.replace(/\/+/g, '/');
  return new URL(normalizedPath, `${SITE.origin}/`).toString();
}

export function truncateDescription(value: string, maxLength = 155): string {
  if (value.length <= maxLength) return value;

  const candidate = value.slice(0, Math.max(0, maxLength - 1));
  const lastSpace = candidate.lastIndexOf(' ');
  const clean = (lastSpace > 0 ? candidate.slice(0, lastSpace) : candidate).trim();
  return `${clean}…`;
}
