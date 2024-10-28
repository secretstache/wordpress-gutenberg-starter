import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classNames from 'classnames';

export const save = ({ attributes }) => {
    const { carouselColor, layoutType } = attributes;

    const blockProps = useBlockProps.save({
        className: classNames('layout-carousel w-full', {
            [`splide-color-${carouselColor?.slug}`]: carouselColor?.slug,
            'is-full-width': layoutType === 'full-width',
        }),
    });

    const innerBlocksProps = useInnerBlocksProps.save({
        className: classNames(
            'splide',
            { 'w-full': layoutType === 'full-width' },
        ),
    });

    return (
        <div {...blockProps}>
            <div {...innerBlocksProps}>
                <div
                    className={classNames(
                        'splide__track',
                        {
                            'mx-auto max-w-[800px] overflow-visible': layoutType === 'default',
                            'w-full': layoutType === 'full-width',
                        },
                    )}
                >
                    <div className="splide__list w-full">
                        {innerBlocksProps.children}
                    </div>
                </div>
            </div>
        </div>
    );
};
