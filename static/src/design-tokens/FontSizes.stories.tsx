import type { Meta, StoryObj } from '@storybook/react';
import { fontSizes } from '@lib/theme';
import { wpSlug } from '@lib/wp-global-styles';

const FontSizes = () => (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {fontSizes.map(({ slug, name, size }) => (
            <div
                key={slug}
                style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
                <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{name}</span>
                    <span style={{ color: '#999', fontSize: '0.75rem' }}>{size}</span>
                    <span style={{ color: '#bbb', fontSize: '0.75rem' }}>{`var(--wp--preset--font-size--${wpSlug(slug)})`}</span>
                    <span style={{ color: '#bbb', fontSize: '0.75rem' }}>.has-{wpSlug(slug)}-font-size</span>
                </div>
                <div style={{ fontSize: size }}>The quick brown fox</div>
            </div>
        ))}
    </div>
);

const meta: Meta<typeof FontSizes> = {
    title: 'Design Tokens',
    component: FontSizes,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof FontSizes>;

export const FontSizes_: Story = {
    name: 'Font Sizes',
};
