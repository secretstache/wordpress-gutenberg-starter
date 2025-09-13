import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { useContext, useCallback, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { useAccordionItem, useFilterBlocks } from '@secretstache/wordpress-gutenberg';

import { ToggleIcon } from '../components/icons.jsx';
import { AccordionContext } from '../index.js';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { title } = attributes;
    const { setActiveItemClientId, activeItemClientId } = useContext(AccordionContext);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), []);

    const { blockRef, toggleItem, isActive } = useAccordionItem({
        itemId: clientId,
        activeItemId: activeItemClientId,
        setActiveItemId: setActiveItemClientId,
        contentSelector: '.wp-block-ssm-accordion__content',
        heightObserverDeps: [ childBlocks ],
    });

    const { isChildSelected } = useSelect((select) => {
        const isChildSelected = select('core/block-editor').hasSelectedInnerBlock(clientId, true);

        return {
            isChildSelected,
        };
    }, []);

    useEffect(() => {
        if (isChildSelected) {
            setActiveItemClientId(clientId);
        }
    }, [ isChildSelected ]);

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

    const blockProps = useBlockProps({
        className: classNames('wp-block-ssm-accordion__item border-[2px] border-gray-50 rounded-20 has-[.is-open]:border-none has-[.is-open]:text-white transition-all has-[.is-open]:bg-[linear-gradient(19.81deg,_#FF9A00_1.08%,_#F15435_49.15%)]', {
            'is-opened': isActive,
        }),
        ref: blockRef,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'p-6 bg-white rounded-20 *:text-gray-300 is-layout-flow',
        },
        {
            allowedBlocks,
        },
    );

    return (
        <>
            <InspectorControls />

            <div {...blockProps}>
                <div
                    className={classNames('wp-block-ssm-accordion__button flex group items-center justify-between gap-8 p-6 cursor-pointer w-full', {
                        'is-open': isActive,
                    })}
                    onClick={toggleItem}
                >

                    <RichText
                        tagName="h3"
                        className="font-bold text-lg transition-colors"
                        value={title}
                        onChange={onTitleChange}
                        placeholder="Enter title..."
                    />

                    <div className="wp-block-ssm-accordion__button-toggle min-w-8 w-8 h-8 flex group-[.is-open]:bg-white transition-colors bg-sunrise rounded-full items-center justify-center">
                        <ToggleIcon />
                    </div>
                </div>

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
