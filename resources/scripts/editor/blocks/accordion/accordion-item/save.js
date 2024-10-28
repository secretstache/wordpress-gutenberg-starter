import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

import { OpenIcon, CloseIcon } from './components/icons';

export const save = ({ attributes }) => {
    const { title, layoutType, headingSlug } = attributes;

    if (!title) {
        return null;
    }

    const isHorizontal = layoutType === 'horizontal';

    const blockProps = useBlockProps.save({
        className: classnames(
            'wp-block-ssm-accordion__item',
            {
                // eslint-disable-next-line max-len
                'flex-grow overflow-hidden transition-all duration-700 ease-in-out w-full md:w-1/6 border-2 border-gray-200 pr-6 md:min-h-96 md:ml-[-20px] first:ml-0 rounded-xl': isHorizontal,
            },
        ),
    });

    return (
        <div {...blockProps}>
            <header className={ classnames(
                    'wp-block-ssm-accordion__header cursor-pointer h-full',
                    {
                        'py-6': !isHorizontal,
                    }) }
                >
                <div className="wp-block-ssm-accordion__header-inner flex w-full items-start justify-between text-left text-gray-900">
                    <RichText.Content
                        tagName="h3"
                        className={`wp-block-ssm-accordion__title font-semibold leading-7 has-${headingSlug}-font-size`}
                        value={title}
                    />

                    <button className="wp-block-ssm-accordion__button ml-6 flex h-7 items-center">
                        <OpenIcon />
                        <CloseIcon />
                    </button>

                </div>
            </header>

            <article className={ classnames(
                    'wp-block-ssm-accordion__content box-border text-base leading-7 text-gray-600 pr-12',
                    {
                        'w-full transition-all ease-in-out duration-700': isHorizontal,
                    }) }>
                <div className={ classnames(
                    'wp-block-ssm-accordion__inner',
                    {
                        'pb-6': !isHorizontal,
                    } )}>
                    <InnerBlocks.Content />
                </div>
            </article>
        </div>
    );
};
