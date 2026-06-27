import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('project cards use the case title as the primary link', () => {
  it('links project titles on the projects index without a duplicate case-structure link', () => {
    const projectsIndex = readFileSync(resolve(process.cwd(), 'src/pages/projects/index.astro'), 'utf8');

    expect(projectsIndex).toContain('<a class="project-title-link" href={`/projects/${project.id}/`}>');
    expect(projectsIndex).not.toContain('View case structure');
  });

  it('links homepage project titles without a separate read-case link', () => {
    const homepage = readFileSync(resolve(process.cwd(), 'src/pages/index.astro'), 'utf8');

    expect(homepage).toContain('<a class="project-title-link" href={`/projects/${project.id}/`}>');
    expect(homepage).not.toContain('Read case structure');
  });
});
