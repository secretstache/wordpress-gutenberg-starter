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
        className: classNames('', {
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
        }),
    });

    return (
        <div {...blockProps}>
            <div className="">
                <MediaSave
                    media={media}
                    backgroundColor={backgroundColor}
                    backgroundMediaType={backgroundMediaType}
                    mediaPosition={mediaPosition}
                />
            </div>

            <div className="wp-block-ssm-split-content__inner">
                <InnerBlocks.Content/>
            </div>
        </div>
    );
};
