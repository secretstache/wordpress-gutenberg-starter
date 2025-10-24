import { addFilter } from '@wordpress/hooks';
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { MediaControl } from '@secretstache/wordpress-gutenberg';

addFilter('blocks.registerBlockType', 'ssm/add-mobile-image-attribute', (settings, name) => {
    if (name !== 'core/image') return settings;

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            mobileImage: {
                type: 'object',
                default: {
                    id: null,
                    url: null,
                    alt: null,
                }
            }
        },
    };
});

addFilter(
    'editor.BlockEdit',
    'ssm/add-mobile-image-control',
    createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            if (props.name !== 'core/image') {
                return <BlockEdit {...props} />;
            }

            const { attributes, setAttributes } = props;
            const { mobileImage } = attributes;

            const onImageSelect = (media) => {
                setAttributes({
                    mobileImage: {
                        id: media?.id,
                        url: media?.url,
                        alt: media?.alt,
                    },
                });
            };

            const onImageRemove = () => {
                setAttributes({
                    mobileImage: {
                        id: null,
                        url: null,
                        alt: null,
                    },
                });
            };

            return (
                <>
                    <BlockEdit {...props} />

                    <InspectorControls>
                        <PanelBody title="Mobile Image">
                            <MediaControl
                                label="Mobile Image"
                                type="image"
                                mediaId={mobileImage?.id}
                                mediaUrl={mobileImage?.url}
                                onSelect={onImageSelect}
                                onRemove={onImageRemove}
                            />
                        </PanelBody>
                    </InspectorControls>
                </>
            );
        };
    }, 'withMobileImageControl')
);
