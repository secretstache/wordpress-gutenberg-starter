export const Logo = ({ logo, setLink = false }) => {
    return (
        <div className="wp-block-ssm-logo-wall__item">
            {
                logo?.linkSource && logo?.linkSource !== '#' ? (
                    <a
                        href="#"
                        {
                            ...(setLink ? {
                                href: logo?.linkSource,
                                target: logo?.linkIsOpenInNewTab ? '_blank' : '_self',
                                rel: logo?.linkIsOpenInNewTab ? 'noopener noreferrer' : '',
                            } : {})
                        }
                    >
                        <img
                            className="block mx-auto object-contain transition-opacity duration-300 !max-w-[16rem] !max-h-[6rem]"
                            src={logo?.url}
                            alt={logo?.alt || 'Partner logo'}
                            width={logo?.width}
                            height={logo?.height}
                        />
                    </a>
                ) : (
                    <img
                        className="block mx-auto object-contain transition-opacity duration-300 !max-w-[16rem] !max-h-[6rem]"
                        src={logo?.url}
                        alt={logo?.alt || 'Partner logo'}
                        width={logo?.width}
                        height={logo?.height}
                    />
                )
            }
        </div>
    );
};
