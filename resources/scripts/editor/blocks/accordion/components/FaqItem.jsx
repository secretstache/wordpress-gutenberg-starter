import { useCallback, useContext, useEffect } from '@wordpress/element';
import { decodeHtmlEntities, useAccordionItem } from '@secretstache/wordpress-gutenberg';
import classnames from 'classnames';

import { AccordionContext } from '../index.jsx';
import { ToggleIcon } from './icons.jsx';

export const FaqItem = ({ post }) => {
    if (!post) return null;

    const {
        setActiveItemClientId,
        activeItemClientId,
    } = useContext(AccordionContext);

    const postId = post.id;
    const isSelected = activeItemClientId === postId;

    const { blockRef, isActive: isOpened, toggleItem } = useAccordionItem({
        itemId: post.id,
        activeItemId: activeItemClientId,
        setActiveItemId: setActiveItemClientId,
        contentSelector: '.wp-block-ssm-accordion__content',
    });

    const onToggleClick = useCallback((e) => {
        e.stopPropagation();
        toggleItem();
    }, [ toggleItem ]);

    useEffect(() => {
        if (isSelected && !isOpened) {
            setActiveItemClientId(postId);
        }
    }, [ isSelected, isOpened, setActiveItemClientId ]);

    const postContent = post?.acf?.faq_description;

    return (
        <div className="wp-block-ssm-accordion__item border-[2px] border-gray-50 rounded-20 transition-all" ref={blockRef}>
            <button
                className={classnames('wp-block-ssm-accordion__button flex group items-center justify-between gap-8 p-6 cursor-pointer w-full', {
                    'is-open': isOpened,
                })}
                onClick={onToggleClick}
            >
                <h3 className="font-bold text-lg transition-colors">
                    {decodeHtmlEntities(post?.title?.rendered) || ''}
                </h3>

                <div className="wp-block-ssm-accordion__button-toggle min-w-8 w-8 h-8 flex group-[.is-open]:bg-white transition-colors bg-sunrise rounded-full items-center justify-center">
                    <ToggleIcon />
                </div>
            </button>

            <div className="wp-block-ssm-accordion__content is-layout-flow max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                <div className="pb-6 px-6">
                    {postContent && (
                        <div className="p-6 bg-white rounded-20 *:text-gray-300 is-layout-flow" dangerouslySetInnerHTML={{ __html: postContent }} />
                    )}
                </div>
            </div>
        </div>
    );
};
