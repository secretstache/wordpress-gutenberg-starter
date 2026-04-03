import type { Preview, Decorator } from '@storybook/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { injectWpGlobalStyles } from '../src/lib/wp-global-styles';
import { SectionWrapper } from '../src/blocks/custom/section-wrapper/SectionWrapper';
import '@wordpress/block-library/build-style/style.css';
// import '@wordpress/block-library/build-style/theme.css';
import '../src/index.css';

// Inject WP preset variables and utility classes before any story renders.
injectWpGlobalStyles();

const LAYOUT_CLASSES = [
    'is-layout-constrained',
    'px-container-padding',
];

export const globalTypes = {
    background: {
        name: 'Background',
        toolbar: {
            icon: 'circlehollow',
            items: [
                { value: 'light', title: 'Light', icon: 'sun' },
                { value: 'dark', title: 'Dark', icon: 'moon' },
            ],
            dynamicTitle: true,
        },
        defaultValue: 'light',
    },
};

const preview: Preview = {
    decorators: [
        // Apply bg-dark bg-black to <body> when Dark background is selected
        ((Story, context) => {
            const isDark = context.globals['background'] === 'dark';
            useEffect(() => {
                document.body.classList.toggle('bg-dark', isDark);
                document.body.classList.toggle('bg-black', isDark);
            }, [isDark]);

            return <Story />;
        }) as Decorator,

        // Add constrained layout classes to #storybook-root for all blocks except SectionWrapper and Pages
        ((Story, context) => {
            const isSectionWrapper = context.component === SectionWrapper;
            const isPage = context.title.startsWith('Pages');
            const isGlobal = context.title.startsWith('Global');
            useEffect(() => {
                const root = document.getElementById('storybook-root');
                if (!root) return;
                LAYOUT_CLASSES.forEach((cls) => root.classList.toggle(cls, !isSectionWrapper && !isPage && !isGlobal));

                return () => LAYOUT_CLASSES.forEach((cls) => root.classList.remove(cls));
            }, [
                isSectionWrapper,
                isPage,
                isGlobal,
            ]);

            return <Story />;
        }) as Decorator,

        ((Story, context) => {
            useEffect(() => {
                // Capture pre-JS HTML before initComponents modifies the DOM.
                // useLayoutEffect fires synchronously after render, before useEffect,
                // so the snapshot is guaranteed to be pre-JS.
                if (context.parameters?.html?.preJs) {
                    const root = document.getElementById('storybook-root');
                    if (root) (window as any).__sbPreJsHtml__ = root.innerHTML;
                }

                let instances: { destroy(): void }[] = [];

                import('../src/assets/scripts/app.js').then(({ initComponents }) => {
                    initComponents().then((insts: unknown[]) => {
                        instances = insts.filter(Boolean) as { destroy(): void }[];
                    });
                });

                return () => {
                    instances.forEach((inst) => inst.destroy());
                };
            });

            return (
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            );
        }) as Decorator,
    ],
    parameters: {
        backgrounds: { disabled: true },
        viewport: {
            options: {
                'sm': { name: 'Small mobile', styles: { width: '320px', height: '568px' } },
                'sm-2': { name: 'Large mobile', styles: { width: '414px', height: '896px' } },
                'md': { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
                'lg': { name: 'Large tablet', styles: { width: '1024px', height: '1366px' } },
                'xl': { name: 'Small desktop', styles: { width: '1280px', height: '100%' } },
                '2xl': { name: 'Large desktop', styles: { width: '1440px', height: '100%' } },
                '3xl': { name: 'Full HD', styles: { width: '1920px', height: '100%' } },
            },
        },
        actions: { disable: true },
        interactions: { disable: true },
        docs: {
            codePanel: true,
        },
        html: {
            removeEmptyComments: true,
            transform: (code: string) => code.replace(/ data-discover="true"/g, ''),
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                includeNames: true,
                order: [
                    'Design Tokens',
                    [
                        'Colors',
                        '*',
                    ],
                    'Global',
                    'Blocks',
                    'Pages',
                    [
                        'Home',
                        '*',
                    ],
                ],
            },
        },
    },
};

export default preview;
