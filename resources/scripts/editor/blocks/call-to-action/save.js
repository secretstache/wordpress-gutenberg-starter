import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import className from 'classnames';

export const save = ({ attributes }) => {
    const {
        backgroundColor,
        buttonPosition,
    } = attributes;

    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const blockProps = useBlockProps.save({
        className: className('px-10 sm:px-14 lg:px-20 py-24 sm:py-32 shadow-xl rounded-3xl', {
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
        }),
    });

    const innerBlocksProps = useInnerBlocksProps.save({
        className: className('wp-block-ssm-call-to-action__inner', {
            'direction-bottom': buttonPosition === 'bottom',
            'direction-right': buttonPosition === 'right',
        }),
    });

    return (
        <div {...blockProps}>
            <div {...innerBlocksProps} />
        </div>
    );
};
