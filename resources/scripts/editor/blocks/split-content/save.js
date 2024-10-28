import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classNames from 'classnames';

import { MediaSave } from './components/media-save.js';

export const save = ({ attributes }) => {
    const {
        backgroundColor = { value: '#fff', slug: 'white' },
        backgroundMediaType = 'image',
        media,
        mediaPosition,
    } = attributes;

    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const blockProps = useBlockProps.save({
        className: classNames('relative flex flex-col md:flex-row shadow-xl rounded-3xl overflow-hidden', {
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
            'md:flex-row-reverse': mediaPosition === 'right',
        }),
    });

    return (
        <div {...blockProps}>
            <div className="relative overflow-hidden w-full md:w-1/2 min-h-[16rem] md:min-h-[24rem] lg:min-h-[32rem]">
                <MediaSave
                    media={media}
                    backgroundColor={backgroundColor}
                    backgroundMediaType={backgroundMediaType}
                    mediaPosition={mediaPosition}
                />
            </div>

            <div className="wp-block-ssm-split-content__inner relative w-full md:w-1/2 p-6 md:p-12 lg:p-24">
                <InnerBlocks.Content/>
            </div>
        </div>
    );
};
