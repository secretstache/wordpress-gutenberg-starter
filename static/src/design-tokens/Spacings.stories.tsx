import type { Meta, StoryObj } from '@storybook/react';
import { spacingSizes } from '@lib/theme';

const toPx = (size: string): string => {
    if (size.endsWith('px')) return size;
    if (size.endsWith('rem')) return `${parseFloat(size) * 16}px`;

    return size;
};

const Spacings = () => (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {spacingSizes.map(({ slug, size }) => (
            <div key={slug} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '380px', flexShrink: 0, display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600, width: '30px' }}>{slug}</span>
                    <span style={{ color: '#999', width: '60px' }}>{size}</span>
                    <span style={{ color: '#bbb', width: '60px' }}>{toPx(size)}</span>
                    <span style={{ color: '#bbb' }}>{`var(--wp--preset--spacing--${slug})`}</span>
                </div>
                <div style={{ background: 'var(--color-black, #000)', height: '8px', width: size, minWidth: '2px', borderRadius: '2px' }} />
            </div>
        ))}
    </div>
);

const meta: Meta<typeof Spacings> = {
    title: 'Design Tokens',
    component: Spacings,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof Spacings>;

export const Spacings_: Story = {
    name: 'Spacings',
};
