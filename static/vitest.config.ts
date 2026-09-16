import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config.js';

export default mergeConfig(
    viteConfig as ViteUserConfig,
    defineConfig({
        plugins: [storybookTest({ configDir: './.storybook' })],
        test: {
            name: 'storybook',
            browser: {
                enabled: true,
                headless: true,
                instances: [{ browser: 'chromium' }],
                provider: playwright(),
            },
        },
    }),
);
