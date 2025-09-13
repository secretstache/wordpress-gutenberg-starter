import { useBlockProps, InspectorControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RadioControl } from '@wordpress/components';
import { MediaControl, LinkControl } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { GridItemContent } from './components/GridItemContent.jsx';

const ALLOWED_BLOCKS = [
    'core/heading',
    'core/paragraph',
    'core/list',
    'ssm/icon',
    'core/image',
    'core/video',
    'core/buttons',
    'core/embed',
];

export const edit = ({ attributes, setAttributes, clientId }) => {
    const {
        isIncludeIcon,
        iconLocation,
        iconImage,
        isIncludeLink,
        linkSource,
        linkIsOpenInNewTab,
    } = attributes;

    const hasInnerBlocks = useSelect((select) => {
        const { getBlockOrder } = select('core/block-editor');

        return getBlockOrder(clientId).length > 0;
    }, [ clientId ]);

    useEffect(() => {
        setAttributes({ hasInnerBlocks });
    }, [ hasInnerBlocks ]);

    const blockProps = useBlockProps({
        className: classNames({
            'cursor-pointer': isIncludeLink,
        }),
    });

    const innerBlocksProps = useInnerBlocksProps(
        {},
        {
            allowedBlocks: ALLOWED_BLOCKS,
            renderAppender: true,
        },
    );

    const onIncludeLinkChange = useCallback((value) => {
        setAttributes({ isIncludeLink: value });
    }, []);

    const onIconSelect = useCallback((media) => {
        setAttributes({ iconImage: { id: media?.id, url: media?.url, alt: media?.alt } });
    }, []);

    const onIconRemove = useCallback(() => {
        setAttributes({ iconImage: { id: null, url: null, alt: null } });
    }, []);

    const onIconLocationChange = useCallback((value) => {
        setAttributes({ iconLocation: value });
    }, []);

    const onIncludeIconChange = useCallback((value) => {
        setAttributes({ isIncludeIcon: value });
    }, []);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Include Icon"
                        checked={isIncludeIcon}
                        onChange={onIncludeIconChange}
                    />

                    {isIncludeIcon && (
                        <>
                            <RadioControl
                                label="Icon Location"
                                selected={iconLocation}
                                options={[
                                    { label: 'Left', value: 'left' },
                                    { label: 'Top', value: 'top' },
                                ]}
                                onChange={onIconLocationChange}
                            />

                            <MediaControl
                                type="image"
                                mediaId={iconImage?.id}
                                mediaUrl={iconImage?.url}
                                onSelect={onIconSelect}
                                onRemove={onIconRemove}
                                selectButtonLabel="Select Icon"
                                removeButtonLabel="Remove Icon"
                            />
                        </>
                    )}

                    <ToggleControl
                        label="Include Link"
                        checked={isIncludeLink}
                        onChange={onIncludeLinkChange}
                    />

                    {isIncludeLink && (
                        <LinkControl
                            url={{
                                value: linkSource,
                                attrName: 'linkSource',
                            }}
                            isOpenInNewTab={{
                                value: linkIsOpenInNewTab,
                                attrName: 'linkIsOpenInNewTab',
                            }}
                            setAttributes={setAttributes}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <GridItemContent attributes={attributes}>
                    <div {...innerBlocksProps} />
                </GridItemContent>
            </div>
        </>
    );
};
