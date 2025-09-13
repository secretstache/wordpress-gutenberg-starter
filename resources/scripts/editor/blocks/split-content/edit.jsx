import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, __experimentalDivider as Divider } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import {
    ColorPaletteControl,
    MediaTypeControl,
    MEDIA_TYPE,
} from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

import { MediaEdit } from './components/MediaEdit.jsx';

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
    }],
    ['core/paragraph', {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit gravida vulputate.</br>Nulla accumsan porta orci nec vehicula. Sed at.',
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
        className: classNames('', {
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
        }),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
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
                <div className="">
                    <MediaEdit
                        media={media}
                        backgroundColor={backgroundColor}
                        backgroundMediaType={backgroundMediaType}
                        mediaPosition={mediaPosition}
                        onMediaSelect={onMediaSelect}
                    />
                </div>

                <div className="wp-block-ssm-split-content__inner">
                    <InnerBlocks
                        template={TEMPLATE}
                        allowedBlocks={ALLOWED_BLOCKS}
                    />
                </div>
            </div>
        </>
    );
};
