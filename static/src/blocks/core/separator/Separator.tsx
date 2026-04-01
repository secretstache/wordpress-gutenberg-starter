import { cx, getSpacingProps, getAlignClass, styleOrUndefined } from '@lib/block-props';
import { resolveColor } from '@lib/theme';
export interface SeparatorProps {
    // Content
    tagName?: 'hr' | 'div';
    // Colors
    backgroundColor?: string;
    // Spacing
    marginTop?: string;
    marginBottom?: string;
    // Layout / other
    align?: 'center' | 'wide' | 'full';
    // Block
    className?: string;
    id?: string;
}

/** Static rendering of core/separator. */
export const Separator = ({
    tagName: Tag = 'hr',
    backgroundColor,
    className,
    id,
    align,
    // spacing
    marginTop,
    marginBottom,
}: SeparatorProps) => {
    const resolvedColor = backgroundColor ? resolveColor(backgroundColor) : undefined;
    const spacingProps = getSpacingProps({ marginTop, marginBottom });

    const blockClass = cx('wp-block-separator', backgroundColor && 'has-text-color', backgroundColor && `has-${backgroundColor}-color`, backgroundColor && `has-${backgroundColor}-background-color`, backgroundColor && 'has-background', 'has-alpha-channel-opacity', getAlignClass({ align }), className);

    const blockStyle = {
        ...(resolvedColor && { backgroundColor: resolvedColor }),
        ...spacingProps.style,
    };

    return (
        <Tag
            className={blockClass}
            style={styleOrUndefined(blockStyle)}
            id={id || undefined}
        />
    );
};

export default Separator;
