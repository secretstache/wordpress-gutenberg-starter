import { registerPlugin, unregisterPlugin } from '@wordpress/plugins';
import { createPortal } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { pasteHandler } from '@wordpress/blocks';
import { getRootContainer } from '@secretstache/wordpress-gutenberg';

export class RootPasteAppenderPlugin {
    name = 'root-paste-appender';
    isRegistered = false;

    constructor(
        rootBlockName = 'ssm/section-wrapper',
        postTypes = ['page', 'post', 'ssm_design_system'],
        tooltipText = 'Paste Rows',
    ) {
        this.rootBlockName = rootBlockName;
        this.postTypes = postTypes;
        this.tooltipText = tooltipText;
    }

    register() {
        const container = getRootContainer();

        if (!container) {
            console.error(`[${this.name}] - root container is not found.`);

            return;
        }

        const onButtonClick = async () => {
            let html = '';
            let plainText = '';

            try {
                // Cmd+C on blocks puts the serialized markup in text/html and only a text
                // rendering in text/plain, so both flavors are needed. Read from the top
                // window, not the canvas iframe — iframe reads silently return empty.
                const items = await window.navigator.clipboard.read();

                for (const item of items) {
                    if (item.types.includes('text/html')) {
                        html = await (await item.getType('text/html')).text();
                    }

                    if (item.types.includes('text/plain')) {
                        plainText = await (await item.getType('text/plain')).text();
                    }
                }
            } catch (error) {
                dispatch('core/notices').createNotice(
                    'error',
                    'Unable to paste. Please allow browser clipboard permissions before continuing.',
                    { type: 'snackbar' },
                );

                return;
            }

            const blocks = (html || plainText) ? pasteHandler({ HTML: html, plainText, mode: 'BLOCKS' }) : [];

            // insertBlocks doesn't enforce the root allowed-blocks restriction, so
            // reject anything that isn't a root block (all-or-nothing, no silent drops)
            if (!Array.isArray(blocks) || !blocks.length || blocks.some((block) => block.name !== this.rootBlockName)) {
                dispatch('core/notices').createNotice(
                    'error',
                    'Only rows can be pasted here. Copy the row(s) first (Ctrl/Cmd+C).',
                    { type: 'snackbar' },
                );

                return;
            }

            dispatch('core/block-editor').insertBlocks(blocks);
        };

        registerPlugin(this.name, {
            render: () => createPortal(
                <button
                    className="components-button block-editor-button-block-appender root-paste-appender"
                    onClick={onButtonClick}
                    aria-label={this.tooltipText}
                    data-tooltip={this.tooltipText}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fillRule="evenodd" clipRule="evenodd" d="M9 3.5h6c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5H9a.5.5 0 0 1-.5-.5V4c0-.28.22-.5.5-.5ZM7.05 4.5H6c-1.1 0-2 .9-2 2V19c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6.5c0-1.1-.9-2-2-2h-1.05c-.23-.86-1.01-1.5-1.95-1.5H9c-.94 0-1.72.64-1.95 1.5Zm9.9 1.5c-.23.86-1.01 1.5-1.95 1.5H9c-.94 0-1.72-.64-1.95-1.5H6a.5.5 0 0 0-.5.5V19c0 .28.22.5.5.5h12a.5.5 0 0 0 .5-.5V6.5A.5.5 0 0 0 18 6h-1.05ZM12.75 10h-1.5v3.25H8v1.5h3.25V18h1.5v-3.25H16v-1.5h-3.25V10Z"></path></svg>
                </button>,
                container,
            ),
        });

        this.isRegistered = true;
    }

    unregister() {
        unregisterPlugin(this.name);
        this.isRegistered = false;
    }
}
