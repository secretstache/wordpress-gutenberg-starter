import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, __experimentalDivider as Divider } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import {
    ColorPaletteControl,
    MediaTypeControl,
    MEDIA_TYPE,
} from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

import { MediaEdit } from './components/media-edit.js';

const ALLOWED_BLOCKS = [
    'core/heading',
    'core/paragraph',
    'core/list',
    'core/buttons',
    'core/details',
    'core/group',
    'gravityforms/form',
];

const TEMPLATE = [
    ['core/heading', {
        level: 2,
        content: 'Lorem ipsum dolor sit amet',
        fontSize: '4xl',
        textColor: 'gray-800',
        textAlign: 'left',
        className: 'tracking-tight',
    }],
    ['core/paragraph', {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit gravida vulputate.</br>Nulla accumsan porta orci nec vehicula. Sed at.',
        fontSize: 'lg',
        textColor: 'gray-700',
        align: 'left',
        className: 'leading-8',
        style: { spacing: { margin: { top: 'var(--wp--preset--spacing--6)' } } },
    }],
];

export const edit = ({ attributes, setAttributes }) => {
    const {
        backgroundColor = { value: '#fff', slug: 'white' },
        backgroundMediaType = 'image',
        media,
        mediaPosition,
    } = attributes;

    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const onMediaTypeChange = useCallback((mediaType) => {
        setAttributes({ backgroundMediaType: mediaType, media: {} });
    }, []);

    const onMediaSelect = useCallback((media) => {
        setAttributes({ media: { id: media?.id, url: media?.url }, backgroundMediaType });
    }, [ backgroundMediaType ]);

    const onMediaRemove = useCallback(() => {
        setAttributes({ media: {} });
    }, []);

    const onMediaPositionChange = useCallback((position) => {
        setAttributes({ mediaPosition: position });
    }, []);

    const blockProps = useBlockProps({
        className: classNames('relative flex flex-col md:flex-row shadow-xl rounded-3xl overflow-hidden', {
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
            'md:flex-row-reverse': mediaPosition === 'right',
        }),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ColorPaletteControl
                        label="Background Color"
                        value={backgroundColor?.value}
                        attributeName="backgroundColor"
                        setAttributes={setAttributes}
                        allowedColors={['white', 'gray-300', 'primary-500', 'secondary-500', 'tertiary-500']}
                    />

                    <Divider />

                    <MediaTypeControl
                        types={[ MEDIA_TYPE.IMAGE, MEDIA_TYPE.VIDEO]}
                        selectedType={backgroundMediaType}
                        onTypeChange={onMediaTypeChange}
                        mediaId={media?.id}
                        mediaUrl={media?.url}
                        onMediaSelect={onMediaSelect}
                        onMediaRemove={onMediaRemove}
                    />

                    <Divider />

                    <SelectControl
                        label="Media Position"
                        value={mediaPosition}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={onMediaPositionChange}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="relative overflow-hidden w-full md:w-1/2 min-h-[16rem] md:min-h-[24rem] lg:min-h-[32rem]">
                    <MediaEdit
                        media={media}
                        backgroundColor={backgroundColor}
                        backgroundMediaType={backgroundMediaType}
                        mediaPosition={mediaPosition}
                        onMediaSelect={onMediaSelect}
                    />
                </div>

                <div className="wp-block-ssm-split-content__inner relative w-full md:w-1/2 p-6 md:p-12 lg:p-24">
                    <InnerBlocks
                        template={TEMPLATE}
                        allowedBlocks={ALLOWED_BLOCKS}
                    />
                </div>
            </div>
        </>
    );
};
