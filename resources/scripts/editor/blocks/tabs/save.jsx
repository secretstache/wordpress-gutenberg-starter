import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSlug } from '@secretstache/wordpress-gutenberg';

import { LAYOUT_TYPE } from './index.jsx';

export const save = ({ attributes }) => {
    const {
        tabs,
        layoutType,
    } = attributes;

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPE.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPE.HORIZONTAL;

    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <div className="wp-block-ssm-tabs__container">
                <div className="wp-block-ssm-tabs__nav">
                    {tabs?.map((tab) => {
                        const title = tab?.attributes?.title;
                        if (!title) return null;

                        const id = getSlug(title);

                        return (
                            <div
                                key={id}
                                className="wp-block-ssm-tabs__nav-item"
                            >
                                <a href={`#${id}`}>
                                    <span>
                                        {title}
                                    </span>
                                </a>
                            </div>
                        );
                    })}
                </div>

                <div className="wp-block-ssm-tabs__content">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};
