import classNames from 'classnames';

export const GridItemContent = ({ attributes, children, className }) => {
    const { isIncludeIcon, iconLocation, iconImage } = attributes;

    const containerClasses = classNames(
        'wp-block-ssm-block-grid__inner',
        className,
    );

    const iconClasses = classNames(
        '',
        {
            'icon-top': iconLocation === 'top',
            'icon-left': iconLocation === 'left',
        },
    );

    return (
        <div className={containerClasses}>
            {isIncludeIcon && iconImage?.url && (
                <div className={iconClasses}>
                    <img
                        src={iconImage?.url}
                        alt={iconImage?.alt || 'Icon'}
                    />
                </div>
            )}

            <div>
                {children}
            </div>
        </div>
    );
};
