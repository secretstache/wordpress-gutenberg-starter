import {
    useBlockProps,
    useInnerBlocksProps,
    RichText,
} from '@wordpress/block-editor';

import { ToggleIcon } from '../components/icons.jsx';

export const save = ({ attributes }) => {
    const { title } = attributes;

    const blockProps = useBlockProps.save({
        className: 'wp-block-ssm-accordion__item border-[2px] border-gray-50 rounded-20 has-[.is-open]:border-none has-[.is-open]:text-white transition-all has-[.is-open]:bg-[linear-gradient(19.81deg,_#FF9A00_1.08%,_#F15435_49.15%)]',
    });

    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'p-6 bg-white rounded-20 *:text-gray-300 is-layout-flow',
    });

    return (
        <>
            <div {...blockProps}>
                <button className="wp-block-ssm-accordion__button flex group items-center justify-between gap-8 p-6 cursor-pointer w-full">
                    <RichText.Content
                        tagName="h3"
                        className="font-bold text-lg transition-colors"
                        value={title}
                    />

                    <div className="wp-block-ssm-accordion__button-toggle min-w-8 w-8 h-8 flex group-[.is-open]:bg-white transition-colors bg-sunrise rounded-full items-center justify-center">
                        <ToggleIcon />
                    </div>
                </button>

                <div className="wp-block-ssm-accordion__content is-layout-flow max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="pb-6 px-6">
                        <div {...innerBlocksProps}>
                            {innerBlocksProps.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
