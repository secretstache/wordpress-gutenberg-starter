import { useBlockProps } from '@wordpress/block-editor';
import { Logo } from '@scripts/editor/blocks/logo-wall/components/logo.js';

export const save = ({ attributes }) => {
    const { logos } = attributes;

    const blockProps = useBlockProps.save();

    if (!logos?.length) {
        return null;
    }

    return (
        <div {...blockProps}>
            <div className="wp-block-ssm-logo-wall__wrapper">
                <div className="splide is-centered">
                    <div className="splide__track">
                        <div className="splide__list items-center">
                            {
                                logos.map((logo) => (
                                    <div
                                        key={logo.id}
                                        className="splide__slide"
                                    >
                                        <Logo logo={logo} setLink={true} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
