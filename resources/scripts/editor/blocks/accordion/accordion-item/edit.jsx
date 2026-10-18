import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { useContext, useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { useAccordionItem, useChildBlockPosition, useFilterBlocks } from '@secretstache/wordpress-gutenberg';

import { AccordionContext } from '../index.jsx';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { title } = attributes;
    const {
        setActiveItemClientId,
        activeItemClientId,
        isAllowedMultiple,
        isOpenedByDefault,
    } = useContext(AccordionContext);

    const { childBlocks, isSelectedWithin } = useSelect(select => {
        const blockEditor = select('core/block-editor');

        return {
            childBlocks: blockEditor.getBlocks(clientId),
            isSelectedWithin: blockEditor.isBlockSelected(clientId) || blockEditor.hasSelectedInnerBlock(clientId, true),
        };
    }, [ clientId ]);

    const { blockRef, isActive, openContent, closeContent } = useAccordionItem({
        itemId: clientId,
        activeItemId: activeItemClientId,
        setActiveItemId: setActiveItemClientId,
        contentSelector: '.wp-block-ssm-accordion__panel',
        heightObserverDeps: [ childBlocks ],
    });

    const allowedBlocks = useFilterBlocks((block) => {
        const isBaseBlock = block.name === 'core/block';
        const isComponentsCategory = block.category === 'ssm-components';
        const noParent = !block.parent;
        const columns = block.name === 'core/columns';

        return isBaseBlock || columns || ( isComponentsCategory && noParent );
    });

    const onTitleChange = useCallback((title) => {
        setAttributes({ title });
    }, []);

    const [ isActiveInMultipleState, setIsActiveInMultipleState ] = useState(false);

    // Selecting the item or any of its blocks (title, canvas, List View) opens it. Clicking the
    // trigger selects the block on mousedown, so the trigger flags that to keep its own toggle working.
    const skipAutoOpen = useRef(false);

    const onClick = () => {
        skipAutoOpen.current = false;

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
                setActiveItemClientId(clientId);
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
        if (!isSelectedWithin) return;

        if (skipAutoOpen.current) {
            skipAutoOpen.current = false;

            return;
        }

        if (isAllowedMultiple) {
            setIsActiveInMultipleState(true);
        } else {
            setActiveItemClientId(clientId);
        }
    }, [ isSelectedWithin ]);

    const { position } = useChildBlockPosition(clientId);

    useEffect(() => {
        if (isOpenedByDefault && position === 0) {
            if (isAllowedMultiple) {
                setIsActiveInMultipleState(true);
            } else {
                setActiveItemClientId(clientId);
            }
        }
    }, [ isOpenedByDefault, isAllowedMultiple, position ]);

    const isOpen = isActiveInMultipleState || isActive;

    const blockProps = useBlockProps({
        className: classNames('wp-block-ssm-accordion__item', {
            'is-open': isOpen,
        }),
        ref: blockRef,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'px-6',
        },
        {
            template: [ [ 'core/paragraph' ] ],
            allowedBlocks,
        },
    );

    return (
        <>
            <InspectorControls />

            <div {...blockProps}>
                <button
                    type="button"
                    className="wp-block-ssm-accordion__trigger"
                    onMouseDown={() => { skipAutoOpen.current = true; }}
                    onClick={onClick}
                >
                    <div className="min-h-0 flex items-center">
                        <div className="wp-block-ssm-accordion__trigger-inner">

                            <RichText
                                tagName="span"
                                className="text-md font-bold uppercase"
                                value={title}
                                onChange={onTitleChange}
                                placeholder="Enter title..."
                            />
                        </div>
                    </div>
                </button>

                <div className="wp-block-ssm-accordion__panel">
                    <div {...innerBlocksProps}>
                        {innerBlocksProps.children}
                    </div>
                </div>
            </div>
        </>
    );
};
