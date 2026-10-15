// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const excludedPaths = new Set(['/admin/', '/privacy/', '/terms/']);
const projectsDirectory = new URL('./src/content/projects/', import.meta.url);

// Match the case pages' verified flag so CMS approval also controls sitemap inclusion.
for (const filename of readdirSync(projectsDirectory).filter((name) => name.endsWith('.md'))) {
	const source = readFileSync(new URL(filename, projectsDirectory), 'utf8');
	const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
	if (parse(frontmatter ?? '')?.verified !== true) {
		excludedPaths.add(`/projects/${filename.slice(0, -3)}/`);
	}
}

export default defineConfig({
	site: 'https://www.goldconcentrator.com',
	output: 'static',
	integrations: [sitemap({ filter: (page) => !excludedPaths.has(new URL(page).pathname) })],
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
		},
	},
});
