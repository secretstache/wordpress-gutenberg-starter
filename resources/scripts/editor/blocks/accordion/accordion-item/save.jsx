import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import { getSlug } from '@secretstache/wordpress-gutenberg';

export const save = ({ attributes }) => {
    const { title } = attributes;

    if (!title) return null;

    const slug = getSlug(title);

    const blockProps = useBlockProps.save({
        className: 'wp-block-ssm-accordion__item',
        ['data-accordion-item']: true,
        ['data-open']: false,
    });

    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'px-6',
    });

    return (
        <div {...blockProps}>
            <button
                type="button"
                className="wp-block-ssm-accordion__trigger"
                aria-expanded="false"
                aria-controls={`accordion-panel-${slug}`}
                data-accordion-trigger
            >
                <div className="min-h-0 flex items-center">
                    <div className="wp-block-ssm-accordion__trigger-inner">
                        <RichText.Content
                            tagName="span"
                            className="text-md font-bold uppercase"
                            value={title}
                        />
                    </div>
                </div>
            </button>

            <div
                id={`accordion-panel-${slug}`}
                className="wp-block-ssm-accordion__panel"
                data-accordion-panel
                aria-hidden="true"
            >
                <div {...innerBlocksProps}>
                    {innerBlocksProps.children}
                </div>
            </div>
        </div>
    );
};
