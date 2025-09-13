import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useEffect, useContext, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classnames from 'classnames';
import { useAccordionItem, useFilterBlocks } from '@secretstache/wordpress-gutenberg';

import { OpenIcon, CloseIcon } from './components/icons';
import { AccordionContext } from '../edit';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const {
        title,
        layoutType: itemLayoutStyle,
    } = attributes;

    const {
        setActiveItemClientId,
        activeItemClientId,
        layoutType: contextLayoutStyle,
    } = useContext(AccordionContext);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), []);

    const { blockRef, isActive: isOpened, toggleItem } = useAccordionItem({
        itemId: clientId,
        activeItemId: activeItemClientId,
        setActiveItemId: setActiveItemClientId,
        contentSelector: '.wp-block-ssm-accordion__content',
        heightObserverDeps: [ childBlocks ],
    });

    useEffect(() => {
        if (itemLayoutStyle !== contextLayoutStyle) {
            setAttributes({ layoutType: contextLayoutStyle });
        }
    }, [ contextLayoutStyle, itemLayoutStyle ]);

    const allowedBlocks = useFilterBlocks((block) => {
        const isBaseBlock = block.name === 'core/block';
        const isComponentsCategory = block.category === 'ssm-components';
        const noParent = !block.parent;
        const columns = block.name === 'core/columns';

        return isBaseBlock || columns || ( isComponentsCategory && noParent );
    });

    const isHorizontal = itemLayoutStyle === 'horizontal';

    const blockProps = useBlockProps({
        className: classnames(
            'wp-block-ssm-accordion__item',
            {
                'is-opened': isOpened,
                // eslint-disable-next-line max-len
                'flex-grow overflow-hidden transition-all duration-700 ease-in-out w-full md:w-1/6 border-2 border-gray-200 pr-6 md:min-h-96 md:ml-[-20px] first:ml-0 rounded-xl': isHorizontal,
            },
        ),
        ref: blockRef,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'wp-block-ssm-accordion__inner',
        },
        {
            allowedBlocks,
        },
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <TextControl
                        label="Title"
                        value={title}
                        onChange={(title) => setAttributes({ title })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>

                <header
                    className={ classnames('wp-block-ssm-accordion__header cursor-pointer', {
                        'py-6': !isHorizontal,
                        'h-full': isHorizontal && !isOpened,
                    })}
                    onClick={toggleItem}
                >

                    <div className="wp-block-ssm-accordion__header-inner">

                        <RichText
                            tagName="h3"
                            className="wp-block-ssm-accordion__title"
                            value={title}
                            onChange={(title) => setAttributes({ title })}
                            placeholder="Enter title..."
                        />

                        <button className="wp-block-ssm-accordion__button">

                            { isOpened ? <CloseIcon /> : <OpenIcon /> }

                        </button>

                    </div>

                </header>

                <article
                    className={classnames('wp-block-ssm-accordion__content', {
                        'is-active': isOpened,
                    })}
                >

                    <div {...innerBlocksProps}>
                        {innerBlocksProps.children}
                    </div>

                </article>

            </div>
        </>
    );
};
