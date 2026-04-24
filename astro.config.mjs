// @ts-check
import { defineConfig } from 'astro/config';
import { cfDataIntegration } from './src/integrations/cfData';

// https://astro.build/config
export default defineConfig({
	site: 'https://pelu10075.github.io',
	integrations: [cfDataIntegration()],
});
