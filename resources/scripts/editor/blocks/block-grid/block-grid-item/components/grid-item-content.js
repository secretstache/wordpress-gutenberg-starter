import classNames from 'classnames';

export const GridItemContent = ({ attributes, children, className }) => {
    const { isIncludeIcon, iconLocation, iconImage } = attributes;

    const containerClasses = classNames(
        'wp-block-ssm-block-grid__inner flex w-full h-full p-6',
        {
            'flex-col': iconLocation === 'top' || !iconImage?.url,
            'flex-row': iconLocation === 'left' && iconImage?.url,
        },
        'items-center',
        className,
    );

    const iconClasses = classNames(
        'flex-shrink-0',
        {
            'mb-4': iconLocation === 'top',
            'mr-6': iconLocation === 'left',
        },
    );

    return (
        <div className={containerClasses}>
            {isIncludeIcon && iconImage?.url && (
                <div className={iconClasses}>
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                            className="w-full !h-full object-cover object-center"
                            src={iconImage?.url}
                            alt={iconImage?.alt || 'Icon'}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-1 min-w-0 w-full text-gray-900 hover:text-gray-900 space-y-3">
                {children}
            </div>
        </div>
    );
};
