import { Fill } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { InnerBlocks, RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useContext, useRef } from '@wordpress/element';
import classNames from 'classnames';
import { useFilterBlocks, getSlug, EmptyBlockAppender } from '@secretstache/wordpress-gutenberg';

import { TabsContext, LAYOUT_TYPE } from '../index.jsx';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { title } = attributes;

    const { activeItemId, setActiveItemId, layoutType } = useContext(TabsContext);

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPE.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPE.HORIZONTAL;

    const isActive = activeItemId === clientId;
    const id = getSlug(title);

    const innerBlocksRef = useRef(null);

    const allowedBlocks = useFilterBlocks((block) => {
        const isBaseBlock = block.name === 'core/block';
        const noParent = !block.parent;

        return noParent || isBaseBlock;
    });

    const { parentId } = useSelect(
        (select) => {
            const { getBlockRootClientId } = select('core/block-editor');
            const parentId = getBlockRootClientId(clientId);

            return {
                parentId,
            };
        }, [],
    );

    const hasInnerBlocks = useSelect((select) => {
        const { getBlockOrder } = select('core/block-editor');

        return getBlockOrder(clientId).length > 0;
    }, []);

    const blockProps = useBlockProps({ className: classNames(
        'wp-block-ssm-tabs__nav-item',
        {
            'is-active': isActive,
        },
    )});

    const innerBlocksProps = useInnerBlocksProps(
        {
            ...blockProps,
            className: classNames('wp-block-ssm-tabs__panel', {
                'is-active': isActive,
            }),
            ref: innerBlocksRef,
        },
        {
            allowedBlocks,
            renderAppender: false,
        },
    );

    return (
        <>
            <Fill name={`tabsNav-${parentId}`}>
                <div
                    {...blockProps}
                    onClick={() => setActiveItemId(clientId)}
                >
                    <a href={`#${id}`}>
                        <RichText
                            tagName="span"
                            allowedFormats={[]}
                            value={title}
                            onChange={(title) => setAttributes({ title })}
                            placeholder="Title"
                            onFocus={(e) => e.stopPropagation()}
                        />
                    </a>
                </div>
            </Fill>

            <div {...innerBlocksProps}>
                {innerBlocksProps.children}

                {
                    hasInnerBlocks
                        ? <InnerBlocks.DefaultBlockAppender />
                        : <EmptyBlockAppender title="This tab is empty" text='Use the "+" button below to add content blocks to your tab' />
                }
            </div>
        </>
    );
};
