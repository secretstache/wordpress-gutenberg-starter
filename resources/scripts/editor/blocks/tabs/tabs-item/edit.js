import { Fill } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { InnerBlocks, RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useContext, useRef } from '@wordpress/element';
import classNames from 'classnames';
import { useFilterBlocks, getSlug } from '@secretstache/wordpress-gutenberg';

import { TabsContext, LAYOUT_TYPES } from '../index.js';
import { EmptyBlockAppender } from '@scripts/editor/components/empty-block-appender.js';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { title } = attributes;

    const { activeItemId, setActiveItemId, layoutType } = useContext(TabsContext);

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPES.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPES.HORIZONTAL;

    const isActive = activeItemId === clientId;
    const id = getSlug(title);

    const innerBlocksRef = useRef(null);

    const allowedBlocks = useFilterBlocks((block) => {
        const isBaseBlock = block.name === 'core/block';
        const isComponentsCategory = block.category === 'ssm-components';
        const noParent = !block.parent;
        const columns = block.name === 'core/columns';

        return isBaseBlock || columns || (isComponentsCategory && noParent);
    });

    const { parentId, isFirst, isLast } = useSelect(
        (select) => {
            const { getBlocks, getBlockRootClientId, getBlockIndex } = select('core/block-editor');
            const parentId = getBlockRootClientId(clientId);
            const siblings = getBlocks(parentId);
            const blockIndex = getBlockIndex(clientId, parentId);

            return {
                parentId,
                isFirst: blockIndex === 0,
                isLast: blockIndex === siblings.length - 1,
            };
        }, [ clientId ],
    );

    const hasInnerBlocks = useSelect((select) => {
        const { getBlockOrder } = select('core/block-editor');

        return getBlockOrder(clientId).length > 0;
    }, [clientId]);

    const blockProps = useBlockProps({ className: classNames(
        'wp-block-ssm-tabs__nav-item',
        'group relative overflow-hidden bg-white hover:bg-gray-50',
        {
            'is-active': isActive,

            'flex-1': isLayoutTypeHorizontal,
            'rounded-l-lg': isLayoutTypeHorizontal && isFirst,
            'rounded-r-lg': isLayoutTypeHorizontal && isLast,

            'rounded-lg shadow-md': isLayoutTypeVertical,
        },
    )});

    const innerBlocksProps = useInnerBlocksProps(
        {
            ...blockProps,
            className: classNames('wp-block-ssm-tabs__panel p-10 min-h-[300px] bg-white rounded-lg shadow-md', {
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
                    <a href={`#${id}`} className="block !no-underline px-4 py-4 text-center">
                        <RichText
                            tagName="span"
                            className={classNames('text-md', {
                                'text-gray-500 hover:text-gray-500': !isActive,
                                'text-primary-500': isActive,
                            })}
                            allowedFormats={[]}
                            value={title}
                            onChange={(title) => setAttributes({ title })}
                            placeholder="Title"
                            onFocus={(e) => e.stopPropagation()}
                        />
                    </a>

                    <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5"
                    />
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
