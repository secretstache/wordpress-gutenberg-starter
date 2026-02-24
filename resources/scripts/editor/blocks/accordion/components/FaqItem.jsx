import { useContext, useEffect, useState } from '@wordpress/element';
import classNames from 'classnames';
import { decodeHtmlEntities, useAccordionItem } from '@secretstache/wordpress-gutenberg';

import { AccordionContext } from '../index.jsx';

export const FaqItem = ({ post, position }) => {
    if (!post) return null;

    const {
        setActiveItemClientId,
        activeItemClientId,
        isAllowedMultiple,
        isOpenedByDefault,
    } = useContext(AccordionContext);

    const postId = post.id;

    const { blockRef, isActive, closeContent, openContent } = useAccordionItem({
        itemId: post.id,
        activeItemId: activeItemClientId,
        setActiveItemId: setActiveItemClientId,
        contentSelector: '.wp-block-ssm-accordion__panel',
    });

    const [ isActiveInMultipleState, setIsActiveInMultipleState ] = useState(false);

    const onClick = () => {
        if (isAllowedMultiple) {
            if (isActiveInMultipleState) {
                setIsActiveInMultipleState(false);
            } else {
                setIsActiveInMultipleState(true);
            }
        } else {
            if (isActive) {
                setActiveItemClientId(false);
            } else {
                setActiveItemClientId(postId);
            }
        }
    };

    useEffect(() => {
        if (isActive) {
            openContent();
        } else {
            closeContent();
        }
    }, [ isActive ]);

    useEffect(() => {
        if (isActiveInMultipleState) {
            openContent();
        } else {
            closeContent();
        }
    }, [ isActiveInMultipleState ]);

    useEffect(() => {
        setActiveItemClientId(false);
        setIsActiveInMultipleState(false);
    }, [ isAllowedMultiple, isOpenedByDefault ]);

    useEffect(() => {
        if (isOpenedByDefault && position === 0) {
            if (isAllowedMultiple) {
                setIsActiveInMultipleState(true);
            } else {
                setActiveItemClientId(postId);
            }
        }
    }, [ isOpenedByDefault, isAllowedMultiple, position ]);

    const postContent = post?.acf?.faq_description;

    const isOpen = isActiveInMultipleState || isActive;

    return (
        <div
            className={classNames('wp-block-ssm-accordion__item', {
                'is-open': isOpen,
            })}
            ref={blockRef}
        >
            <button
                type="button"
                className="wp-block-ssm-accordion__trigger"
                onClick={onClick}
            >
                <div className="min-h-0 flex items-center">
                    <div className="wp-block-ssm-accordion__trigger-inner">
                        <span className="text-md font-bold uppercase">{decodeHtmlEntities(post?.title?.rendered) || ''}</span>
                    </div>
                </div>
            </button>

            <div className="wp-block-ssm-accordion__panel">
                {postContent && (
                    <div className="px-6" dangerouslySetInnerHTML={{ __html: postContent }} />
                )}
            </div>
        </div>
    );
};
