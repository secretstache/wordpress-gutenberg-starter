import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { useFilterBlocks } from '@secretstache/wordpress-gutenberg';

import { EditProps } from '@scripts/editor/types';

const TEMPLATE = [
    ['core/image'],
    ['core/heading', { level: 3 }],
    ['core/paragraph']
];

export const edit = ({ attributes, setAttributes, clientId }: EditProps<{ hasInnerBlocks: boolean }>) => {
    const { hasInnerBlocks: savedHasInnerBlocks } = attributes;

    const hasInnerBlocks = useSelect(
        (select) => {
            const { getBlockOrder } = select('core/block-editor');

            // @ts-ignore
            return getBlockOrder(clientId).length > 0;
        },
        [],
    );

    useEffect(() => {
        if (hasInnerBlocks !== savedHasInnerBlocks) {
            setAttributes({ hasInnerBlocks });
        }
    }, [ hasInnerBlocks, savedHasInnerBlocks ]);

    const allowedBlocks = useFilterBlocks((block: { name: string; category: string; parent: any; }) => {
        const isBaseBlock = block.name === 'core/block';
        const isComponentsCategory = block.category === 'ssm-components';
        const noParent = !block.parent;
        const isParagraph = block.name === 'core/paragraph';

        return isBaseBlock || isParagraph || (isComponentsCategory && noParent);
    });

    const blockProps = useBlockProps({
        className: 'wp-block-ssm-block-grid__item ',
    });

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks,
        template: TEMPLATE,
    });

    return (
        <div {...innerBlocksProps} />
    );
};
