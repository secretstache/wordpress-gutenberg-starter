import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useFilterBlocks } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';
import { useSelect } from '@wordpress/data';
import { useContext, useEffect } from '@wordpress/element';
import { SplideContext } from '../edit.js';


import { EmptyBlockAppender } from '@scripts/editor/components/empty-block-appender.js';

export const edit = ({ setAttributes, clientId }) => {
    const { isPreview, layoutType } = useContext(SplideContext);

    const hasInnerBlocks = useSelect((select) => {
        const { getBlockOrder } = select('core/block-editor');

        return getBlockOrder(clientId).length > 0;
    }, [ clientId ]);

    useEffect(() => {
        setAttributes({ hasInnerBlocks });
    }, [ hasInnerBlocks ]);

     useEffect(() => {
        setAttributes({ parentLayoutType: layoutType });
    }, [ layoutType ]);

     const blockProps = useBlockProps({
        className: classNames(
            'relative min-h-[430px] p-4 flex-shrink-0',
            'overflow-visible',
            'z-[1]',
            {
                'rounded-xl border border-dashed border-gray-500': !isPreview && layoutType === 'full-width',
                'w-full max-w-[100%] rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out transform': layoutType === 'default',
                'max-w-full': layoutType === 'full-width',
            },
        ),
    });

    const allowedBlocks = useFilterBlocks((block) => {
        const isBaseBlock = block.name === 'core/block';
        const isComponentsCategory = block.category === 'ssm-components';
        const noParent = !block.parent;
        const isParagraph = block.name === 'core/paragraph';
        const isColumns = block.name === 'core/columns';

        return isBaseBlock || isParagraph || isColumns || (isComponentsCategory && noParent);
    });

    const innerBlocksProps = useInnerBlocksProps(
        blockProps,
        {
            allowedBlocks,
            renderAppender: false,
        },
    );

    return (
        <div {...innerBlocksProps}>
            <div className="wp-block-ssm-slide__inner relative px-4 py-5 sm:p-6 overflow-visible z-[1]">
                {innerBlocksProps.children}

                {
                    hasInnerBlocks
                        ? <InnerBlocks.DefaultBlockAppender />
                        : <EmptyBlockAppender title="This slide is empty" text='Use the "+" button below to add content blocks to your slide' />
                }
            </div>
        </div>
    );
};
