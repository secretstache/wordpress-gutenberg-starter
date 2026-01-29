export const Logo = ({ logo, setLink = false }) => {
    const content = (
        <img
            src={logo?.url}
            alt={logo?.alt || 'Logo Item'}
            loading="lazy" 
            className="max-h-24 w-auto"
        />
    );

    return (
        logo?.linkSource && logo?.linkSource !== '#' ?(
            <a
                href={setLink ? logo?.linkSource : "#"}
                target={setLink && logo?.linkIsOpenInNewTab ? '_blank' : '_self'}
                rel={setLink && logo?.linkIsOpenInNewTab ? 'noopener noreferrer' : 'noopener'}
            >
                {content} 
            </a>
        ) : (
            <>
                {content}
            </>
        )
    );
};
