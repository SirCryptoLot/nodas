import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gidai = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/gidai' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string().min(70).max(170),
    date: z.string(),
    short: z.string(),
    order: z.number(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { gidai };
