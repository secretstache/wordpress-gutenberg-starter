import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSlug } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

export const save = ({ attributes }) => {
    const { title } = attributes;

    if (!title) return null;

    const id = getSlug(title);

    const blockProps = useBlockProps.save({
        id,
        className: classNames('wp-block-ssm-tabs__panel'),
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
};
