import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One aligned word/gloss pair in an interlinear line. */
const morpheme = z.object({
  w: z.string(), // source word: what was built
  g: z.string(), // gloss: its parts, in Leipzig-style caps
});

/** Links are optional: anything missing is simply not rendered in production. */
const links = z
  .object({
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    paper: z.string().url().optional(),
  })
  .default({});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    context: z.string(), // where / with whom
    period: z.string(),
    order: z.number(),
    gloss: z.array(morpheme).min(1),
    translation: z.string(), // the one-line "why it matters"
    stack: z.array(z.string()),
    languages: z.array(z.string()).default([]), // human languages touched
    links,
    todo: z.array(z.string()).default([]), // missing evidence, shown only in dev
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    status: z.string(),
    year: z.number().optional(),
    order: z.number(),
    role: z.string(),
    related: z.string().optional(), // slug of a project entry
    links,
    todo: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    org: z.string(),
    role: z.string(),
    location: z.string(),
    period: z.string(),
    order: z.number(),
    summary: z.string(),
    stack: z.array(z.string()),
    points: z.array(z.string()),
  }),
});

export const collections = { projects, research, experience };
