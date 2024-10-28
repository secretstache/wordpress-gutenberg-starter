import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classNames from 'classnames';

export const save = ({ attributes }) => {
    const { parentLayoutType, hasInnerBlocks } = attributes;

    if (!hasInnerBlocks) {
        return null;
    }

    const blockProps = useBlockProps.save({
        className: classNames(
            'splide__slide',
            'relative min-h-[430px] p-4 flex-shrink-0',
            'overflow-visible',
            'z-[1]',
            {
                'w-full max-w-[100%] rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out transform': parentLayoutType === 'default',
                'max-w-full': parentLayoutType === 'full-width',
            },
        ),
    });

    const innerBlocksProps = useInnerBlocksProps.save(blockProps);

    return (
        <div {...innerBlocksProps}>
            <div className="wp-block-ssm-slide__inner relative px-4 py-5 sm:p-6 overflow-visible z-[1]">
                {innerBlocksProps.children}
            </div>
        </div>
    );
};
