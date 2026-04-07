import type { Meta, StoryObj } from '@storybook/react';
import { SectionWrapper } from './SectionWrapper';
import { Heading } from '@blocks/core/heading/Heading';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';
import { Buttons } from '@blocks/core/buttons/Buttons';
import { Button } from '@blocks/core/button/Button';
import { palette, colorLabels } from '@lib/theme';

const colorSlugs = palette.map(({ slug }) => slug);
const spacingValues = [
    1,
    2,
    3,
    4,
    5,
    6,
];

function spacingArgType(description: string): Record<string, unknown> {
    return {
        control: { type: 'select' },
        options: spacingValues,
        description,
        table: { category: 'Spacing' },
    };
}

interface FlatArgs {
    mt?: number;
    mb?: number;
    pt?: number;
    pb?: number;
    mobileMt?: number;
    mobileMb?: number;
    mobilePt?: number;
    mobilePb?: number;
    bgColor?: string;
    bgImage?: string;
    bgVideo?: string;
    bgPosition?: string;
    bgFit?: string;
    overlayFrom?: string;
    overlayFromOpacity?: number;
    overlayTo?: string;
    overlayToOpacity?: number;
    [key: string]: unknown;
}

/**
 * Rebuild the nested bg / spacing objects from flat story args.
 */
function buildProps({
    // spacing — desktop
    mt,
    mb,
    pt,
    pb,
    // spacing — mobile
    mobileMt,
    mobileMb,
    mobilePt,
    mobilePb,
    // bg
    bgColor,
    bgImage,
    bgVideo,
    bgPosition,
    bgFit,
    overlayFrom,
    overlayFromOpacity,
    overlayTo,
    overlayToOpacity,
    // passthrough
    ...rest
}: FlatArgs) {
    const hasSpacing = mt || mb || pt || pb;
    const hasMobileSpacing = mobileMt || mobileMb || mobilePt || mobilePb;
    const hasBgMedia = bgImage || bgVideo;
    const hasBg = bgColor || hasBgMedia;

    const spacing =
        hasSpacing || hasMobileSpacing
            ? {
                  ...(mt && { mt }),
                  ...(mb && { mb }),
                  ...(pt && { pt }),
                  ...(pb && { pb }),
                  ...(hasMobileSpacing && {
                      mobile: {
                          ...(mobileMt && { mt: mobileMt }),
                          ...(mobileMb && { mb: mobileMb }),
                          ...(mobilePt && { pt: mobilePt }),
                          ...(mobilePb && { pb: mobilePb }),
                      },
                  }),
              }
            : {};

    const bg = hasBg
        ? {
              ...(bgColor && { color: bgColor }),
              ...(hasBgMedia && {
                  media: {
                      ...(bgImage && { image: bgImage }),
                      ...(bgVideo && { video: bgVideo }),
                      ...(bgPosition && { position: bgPosition }),
                      ...(bgFit && { fit: bgFit }),
                  },
              }),
              overlay: {
                  ...(overlayFrom !== undefined && { from: overlayFrom }),
                  ...(overlayFromOpacity !== undefined && { fromOpacity: overlayFromOpacity }),
                  ...(overlayTo !== undefined && { to: overlayTo }),
                  ...(overlayToOpacity !== undefined && { toOpacity: overlayToOpacity }),
              },
          }
        : {};

    return {
        ...rest,
        ...(Object.keys(spacing).length && { spacing }),
        ...(Object.keys(bg).length && { bg }),
    };
}

const meta: Meta<any> = {
    title: 'Blocks/Custom/SectionWrapper',
    component: SectionWrapper,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        controls: {
            categoryOrder: [
                'Background',
                'Overlay',
                'Spacing',
                'Block',
            ],
        },
    },
    argTypes: {
        // Background
        fullHeight: { control: 'boolean', description: 'Adds min-h-screen to wrapper', table: { category: 'Background' } },
        bgColor: {
            control: { type: 'select', labels: colorLabels },
            options: colorSlugs,
            description: 'Background color slug → bg-{slug}',
            table: { category: 'Background' },
        },
        bgImage: {
            control: 'text',
            description: 'Background image URL',
            table: { category: 'Background' },
        },
        bgVideo: {
            control: 'text',
            description: 'Background video URL',
            table: { category: 'Background' },
        },
        bgPosition: {
            control: 'select',
            options: [
                'center',
                'top',
                'bottom',
                'left',
                'right',
            ],
            description: 'object-position',
            table: { category: 'Background' },
        },
        bgFit: {
            control: 'select',
            options: [
                'cover',
                'contain',
                'fill',
            ],
            description: 'object-fit',
            table: { category: 'Background' },
        },

        // Overlay
        overlayFrom: {
            control: 'text',
            description: 'Gradient-from color slug (default: charcoal)',
            table: { category: 'Overlay' },
        },
        overlayFromOpacity: {
            control: { type: 'range', min: 0, max: 100, step: 5 },
            description: 'Gradient-from opacity 0–100',
            table: { category: 'Overlay' },
        },
        overlayTo: {
            control: 'text',
            description: 'Gradient-to color slug (default: charcoal)',
            table: { category: 'Overlay' },
        },
        overlayToOpacity: {
            control: { type: 'range', min: 0, max: 100, step: 5 },
            description: 'Gradient-to opacity 0–100',
            table: { category: 'Overlay' },
        },

        // Spacing — Desktop
        mt: spacingArgType('Margin top (desktop) → md:mt-ssm-{n}'),
        mb: spacingArgType('Margin bottom (desktop) → md:mb-ssm-{n}'),
        pt: spacingArgType('Padding top (desktop) → md:pt-ssm-{n}'),
        pb: spacingArgType('Padding bottom (desktop) → md:pb-ssm-{n}'),

        // Spacing — Mobile
        mobileMt: spacingArgType('Margin top (mobile) → max-md:mt-ssm-{n}'),
        mobileMb: spacingArgType('Margin bottom (mobile) → max-md:mb-ssm-{n}'),
        mobilePt: spacingArgType('Padding top (mobile) → max-md:pt-ssm-{n}'),
        mobilePb: spacingArgType('Padding bottom (mobile) → max-md:pb-ssm-{n}'),

        // Block
        className: { control: 'text', description: 'Additional CSS classes on the wrapper', table: { category: 'Block' } },
        id: { control: 'text', description: 'HTML id on the wrapper (anchor)', table: { category: 'Block' } },

        // Internal
        spacing: { table: { disable: true } },
        bg: { table: { disable: true } },
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

function render(args: FlatArgs) {
    return (
        <SectionWrapper {...buildProps(args)}>
            <Heading
                content="Section Heading"
                level={2}
            />
            <Paragraph>This is a paragraph inside the section wrapper. It demonstrates how text content sits within the constrained content area.</Paragraph>
            <Buttons>
                <Button
                    text="Primary"
                    url="#"
                    customStyle="fill"
                />
                <Button
                    text="Secondary"
                    url="#"
                    customStyle="outline"
                />
            </Buttons>
        </SectionWrapper>
    );
}

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
    args: {},
    render,
};

// ─── With Color Background ────────────────────────────────────────────────────
export const ColorBackground: Story = {
    args: {
        bgColor: 'black',
    },
    render,
};

// ─── With Image Background ───────────────────────────────────────────────────
export const ImageBackground: Story = {
    args: {
        bgImage: 'assets/images/cms/placeholder.svg',
        overlayFrom: 'black',
        overlayFromOpacity: 60,
        overlayTo: 'black',
        overlayToOpacity: 0,
    },
    render,
};

// ─── With Video Background ───────────────────────────────────────────────────
export const VideoBackground: Story = {
    args: {
        bgVideo: 'assets/video/placeholder.mp4',
        overlayFrom: 'black',
        overlayFromOpacity: 50,
        overlayTo: 'black',
        overlayToOpacity: 0,
    },
    render,
};
