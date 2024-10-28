import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

export const TEMPLATE = [
    ['core/columns', {
        verticalAlignment: 'center',
        style: {
            spacing: {
                blockGap: '2rem',
            },
        },
    }, [
        ['core/column', {
            width: '66.66%',
            verticalAlignment: 'center',
        }, [
            ['core/heading', {
                level: 2,
                content: 'Lorem ipsum dolor sit amet',
                textAlign: 'left',
            }],
            ['core/paragraph', {
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>Morbi suscipit gravida vulputate. Nulla accumsan porta orci nec vehicula. Sed at.',
                fontSize: 'lg',
                align: 'left',
            }],
        ]],
        ['core/column', {
            width: '33.33%',
            verticalAlignment: 'center',
        }, [
            ['core/buttons', {
                layout: {
                    type: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                },
                style: {
                    spacing: {
                        margin: {
                            top: 'var(--wp--preset--spacing--3)',
                        },
                    },
                },
            }, [
                ['core/button', {
                    text: 'Button Label',
                }],
            ]],
        ]],
    ]],
];

registerBlockType(blockMetadata, {
    edit,
    save,
});
