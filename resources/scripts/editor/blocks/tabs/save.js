import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSlug } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

import { LAYOUT_TYPES } from './index.js';

export const save = ({ attributes }) => {
    const {
        tabs,
        layoutType,
        tabItemColor,
    } = attributes;

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPES.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPES.HORIZONTAL;

    const blockProps = useBlockProps.save({
        className: classNames({
            'is-vertical': isLayoutTypeVertical,
            [`tabs-color-${tabItemColor?.slug}`]: tabItemColor?.slug,
        }),
    });

    return (
        <div {...blockProps}>
            <div className={classNames('wp-block-ssm-tabs__container', {
                'block md:flex md:gap-3': isLayoutTypeVertical,
            })}>
                <div className={classNames('wp-block-ssm-tabs__nav isolate flex', {
                    'mb-2 md:mb-0 flex-row md:flex-col md:gap-2 w-full md:w-1/4': isLayoutTypeVertical,
                    'mb-2 divide-x divide-gray-200 rounded-lg shadow-md': isLayoutTypeHorizontal,
                })}>
                    {tabs?.map((tab, index) => {
                        const title = tab?.attributes?.title;
                        if (!title) return null;

                        const id = getSlug(title);

                        const isFirst = index === 0;
                        const isLast = index === tabs.length - 1;

                        return (
                            <div
                                key={id}
                                className={classNames(
                                    'wp-block-ssm-tabs__nav-item',
                                    'group relative overflow-hidden bg-white hover:bg-gray-50',
                                    {
                                        'flex-1': isLayoutTypeHorizontal,
                                        'rounded-l-lg': isLayoutTypeHorizontal && isFirst,
                                        'rounded-r-lg': isLayoutTypeHorizontal && isLast,

                                        'rounded-lg shadow-md': isLayoutTypeVertical,
                                    },
                                )}
                            >
                                <a href={`#${id}`} className="block !no-underline px-4 py-4 text-center">
                                    <span className="text-md text-gray-500 hover:text-gray-500">
                                        {title}
                                    </span>
                                </a>

                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 bottom-0 h-0.5"
                                />
                            </div>
                        );
                    })}
                </div>

                <div className={classNames('wp-block-ssm-tabs__content', {
                    'w-full md:w-3/4': isLayoutTypeVertical,
                })}>
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};
