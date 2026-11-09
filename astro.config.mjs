// @ts-check
import { defineConfig } from 'astro/config';

// TODO: set `site` once a domain or deploy target is chosen.
export default defineConfig({
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
