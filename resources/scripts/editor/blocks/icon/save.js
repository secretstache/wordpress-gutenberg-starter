import { useBlockProps } from "@wordpress/block-editor";

import { getSizeClass, getSizeValue, resizeSvg } from "./index.js";

export const save = ({ attributes }) => {
    const { media, svgCode, size } = attributes;

    const hasImage = media.id && media.url;
    const isSvg = hasImage && svgCode;

    const blockProps = useBlockProps.save({ className: getSizeClass(size) });

    const resizedSvgCode = svgCode ? resizeSvg(svgCode, getSizeValue(size)) : '';

    return (
        <div {...blockProps}>
            {hasImage && (
                isSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: resizedSvgCode }} />
                ) : (
                    <img src={media.url} alt={media.alt} />
                )
            )}
        </div>
    );
};
