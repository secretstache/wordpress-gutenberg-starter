import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export const save = ({ attributes }) => {
    const blockProps = useBlockProps.save();

    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'splide',
    });

    return (
        <div {...blockProps}>
            <div {...innerBlocksProps}>
                <div className="splide__track">
                    <div className="splide__list">
                        {innerBlocksProps.children}
                    </div>
                </div>
            </div>
        </div>
    );
};
