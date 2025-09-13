import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';
import { GridItemContent } from './components/GridItemContent.jsx';

export const save = ({ attributes }) => {
    const { isIncludeLink, linkSource, linkIsOpenInNewTab, hasInnerBlocks } = attributes;

    if (!hasInnerBlocks) {
        return null;
    }

    const blockProps = useBlockProps.save({
        className: classNames({
            'cursor-pointer': isIncludeLink,
        }),
    });

    return (
        <div {...blockProps}>
            {isIncludeLink ? (
                <a
                    href={linkSource || "#"}
                    target={linkIsOpenInNewTab ? "_blank" : "_self"}
                    rel={linkIsOpenInNewTab ? "noopener noreferrer" : "noopener"}
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
