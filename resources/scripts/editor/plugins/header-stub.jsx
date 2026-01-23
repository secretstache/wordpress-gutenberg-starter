import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin, unregisterPlugin } from '@wordpress/plugins';
import { useEffect, useState } from '@wordpress/element';
import { getRootContainer } from '@secretstache/wordpress-gutenberg';

import { EditableSvg } from '@scripts/client/utils/utilities.js';


export class HeaderStubPlugin {
    name = 'header-stub';
    isRegistered = false;

    constructor(postTypes = ['page', 'post']) {
        this.postTypes = postTypes;
    }

    register() {
        registerPlugin(this.name, {
            render: () => {
                const meta = useSelect((select) =>
                    select('core/editor').getEditedPostAttribute('meta'),
                );

                const [ headerMarkup, setHeaderMarkup ] = useState(null);

                const { isShowHeader = true } = meta;

                const { editPost } = useDispatch('core/editor');

                useEffect(() => {
                    fetch(`/wp-json/ssm/v1/get-header`, {
                        method: 'GET',
                        headers: {
                            'X-WP-Nonce': window.wpApiSettings.nonce,
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            setHeaderMarkup(data.html);
                        })
                        .catch(console.log);
                }, []);

                useEffect(() => {
                    if (!headerMarkup) return;

                    const rootContainer = getRootContainer();

                    if (rootContainer) {
                        if (isShowHeader) {
                            this.insertHeader(headerMarkup);
                        } else {
                            this.removeHeader();
                        }
                    }
                }, [ isShowHeader, headerMarkup ]);

                const onIsShowHeaderChange = () => editPost({
                    meta: { ...meta, isShowHeader: !isShowHeader },
                });

                return (
                    <PluginDocumentSettingPanel
                        name="header-settings"
                        title="Header"
                    >
                        <ToggleControl
                            label="Preview Header"
                            checked={isShowHeader}
                            onChange={onIsShowHeaderChange}
                        />
                    </PluginDocumentSettingPanel>
                );
            },
            icon: 'admin-generic',
        });

        this.isRegistered = true;
    }

    unregister() {
        unregisterPlugin(this.name);
        this.isRegistered = false;
    }

    insertHeader(headerMarkup) {
        this.removeHeader();

        const rootContainer = getRootContainer();

        rootContainer.insertAdjacentHTML('afterbegin', headerMarkup);
        Array.from(rootContainer.querySelectorAll('.editable-svg')).map((img) => EditableSvg(img));
    };

    removeHeader() {
        const rootContainer = getRootContainer();
        const header = rootContainer?.querySelector('header.site-header');

        if (header) {
            header.remove();
        }
    };
}
