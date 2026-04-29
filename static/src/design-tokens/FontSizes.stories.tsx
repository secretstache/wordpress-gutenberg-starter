import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fontSizes, type FontSizeEntry } from '@lib/theme';
import { wpSlug } from '@lib/wp-global-styles';

interface SizeRange {
    minPx: number;
    maxPx: number;
}

function resolveSizeRange(size: string): SizeRange | null {
    const varName = size.match(/var\((--[\w-]+)\)/)?.[1];
    if (!varName) return null;

    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    // Compiled format: clamp(4rem, 16.5vw + -3rem, 9.5625rem)
    const match = value.match(/clamp\(([\d.]+)rem,.*,\s*([\d.]+)rem\)/);
    if (!match) return null;

    return {
        minPx: Math.round(parseFloat(match[1]) * 16),
        maxPx: Math.round(parseFloat(match[2]) * 16),
    };
}

const px2rem = (px: number) => `${+(px / 16).toFixed(4).replace(/\.?0+$/, '')}rem`;

const FontSizeRow = ({ slug, name, size }: FontSizeEntry) => {
    const [range, setRange] = useState<SizeRange | null>(null);

    useEffect(() => {
        setRange(resolveSizeRange(size));
    }, [size]);

    return (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{name}</span>
                {range && (
                    <span style={{ color: '#666', fontSize: '0.75rem' }}>
                        {range.maxPx}px/{px2rem(range.maxPx)}
                    </span>
                )}
                <span style={{ color: '#999', fontSize: '0.75rem' }}>{size}</span>
                <span style={{ color: '#bbb', fontSize: '0.75rem' }}>{`var(--wp--preset--font-size--${wpSlug(slug)})`}</span>
                <span style={{ color: '#bbb', fontSize: '0.75rem' }}>.has-{wpSlug(slug)}-font-size</span>
            </div>
            <div style={{ fontSize: size }}>The quick brown fox</div>
        </div>
    );
};

const FontSizes = () => (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {fontSizes.map((entry) => (
            <FontSizeRow key={entry.slug} {...entry} />
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
