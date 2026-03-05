import { ICON_TYPES, getIconEntry } from './icons.js';
import { getMaskStyle } from './utils.js';

export const IconDisplay = ({
    iconName,
    iconType = ICON_TYPES.FONT,
    iconSize = 48,
    className = '',
    style = {},
    color = 'currentColor',
}) => {
    const icon = getIconEntry(iconType, iconName);

    if (!icon) {
        return null;
    }

    if (icon.type === ICON_TYPES.FONT) {
        return (
            <span
                className={`${icon.className || ''} ${className}`.trim()}
                style={{
                    fontSize: `${iconSize}px`,
                    lineHeight: 1,
                    display: 'inline-block',
                    color,
                    ...style,
                }}
                aria-hidden="true"
            />
        );
    }

    return (
        <span
            className={`ssm-icon-display ${className}`}
            style={{
                'width': `${iconSize}px`,
                'height': `${iconSize}px`,
                '--icon-color': color,
                ...style,
            }}
        >
            <span
                className="ssm-icon-display__mask"
                style={getMaskStyle(icon.url)}
            />
        </span>
    );
};
