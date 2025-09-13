import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';

export const save = ({ attributes }) => {
    const { layoutType, isOpenedByDefault } = attributes;

    const isHorizontal = layoutType === 'horizontal';

    const blockProps = useBlockProps.save({
        className: classNames('wp-block-ssm-accordion', {
            'is-horizontal': isHorizontal,
            'is-opened-by-default': isOpenedByDefault,
        }),
    });

    return (
        <div {...blockProps}>
            <div className={classNames('mt-10', {
                'flex flex-wrap md:flex-nowrap': isHorizontal,
                'divide-y divide-gray-900/10': !isHorizontal,
            })}>
                <InnerBlocks.Content/>
            </div>
        </div>
    );
};
