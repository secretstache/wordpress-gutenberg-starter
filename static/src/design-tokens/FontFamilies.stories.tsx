import type { Meta, StoryObj } from '@storybook/react';
import { fontFamilies } from '@lib/theme';

const FontFamilies = () => (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {fontFamilies.map(({ slug, name, fontFamily }) => (
            <div key={slug}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{name}</span>
                    <span style={{ color: '#999', fontSize: '0.75rem' }}>{fontFamily}</span>
                    <span style={{ color: '#bbb', fontSize: '0.75rem' }}>{`var(--wp--preset--font-family--${slug})`}</span>
                    <span style={{ color: '#bbb', fontSize: '0.75rem' }}>.has-{slug}-font-family</span>
                </div>
                <div style={{ fontFamily, fontSize: '1.5rem' }}>The quick brown fox jumps over the lazy dog</div>
            </div>
        ))}
    </div>
);

const meta: Meta<typeof FontFamilies> = {
    title: 'Design Tokens',
    component: FontFamilies,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof FontFamilies>;

export const FontFamilies_: Story = {
    name: 'Font Families',
};
