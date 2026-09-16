import type { Meta, StoryObj } from '@storybook/react';
import { palette } from '@lib/theme';

const Colors = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
        {palette.map(({ slug, name, color }) => (
            <div key={slug}>
                <div
                    style={{
                        background: color,
                        height: '80px',
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        marginBottom: '0.5rem',
                    }}
                />
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>{color}</div>
                <div style={{ color: '#999', fontSize: '0.75rem', marginTop: '0.25rem' }}>--color-{slug}</div>
                <div style={{ color: '#bbb', fontSize: '0.7rem' }}>.has-{slug}-color</div>
                <div style={{ color: '#bbb', fontSize: '0.7rem' }}>.has-{slug}-background-color</div>
                <div style={{ color: '#bbb', fontSize: '0.7rem' }}>.has-{slug}-border-color</div>
            </div>
        ))}
    </div>
);

const meta: Meta<typeof Colors> = {
    title: 'Design Tokens/Colors',
    component: Colors,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof Colors>;

export const Colors_: Story = {
    name: 'Colors',
};
