import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';
import { GridItemContent } from './components/grid-item-content';

export const save = ({ attributes }) => {
    const { isIncludeLink, linkSource, linkIsOpenInNewTab, hasInnerBlocks, parentLayoutType } = attributes;

    if (!hasInnerBlocks) {
        return null;
    }

    const blockProps = useBlockProps.save({
        className: classNames(
            'col-span-1',
            {
                'cursor-pointer': isIncludeLink,
                'rounded-xl shadow-lg': parentLayoutType === 'default',
                'no-shadow flat': parentLayoutType === 'seamless',
            },
        ),
    });

    return (
        <div {...blockProps}>
            {isIncludeLink ? (
                <a
                    href={linkSource || "#"}
                    target={linkIsOpenInNewTab ? "_blank" : "_self"}
                    rel={linkIsOpenInNewTab ? "noopener noreferrer" : "noopener"}
                    className="block w-full h-full !no-underline"
                >
                    <GridItemContent attributes={attributes}>
                        <InnerBlocks.Content />
                    </GridItemContent>
                </a>
            ) : (
                <GridItemContent attributes={attributes}>
                    <InnerBlocks.Content />
                </GridItemContent>
            )}
        </div>
    );
};
