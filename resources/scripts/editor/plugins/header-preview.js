import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { useEffect, useState } from '@wordpress/element';
import { getRootContainer } from '@secretstache/wordpress-gutenberg';

import { EditableSvg } from '@scripts/client/utils/utilities.js';

const insertHeader = (headerMarkup) => {
    removeHeader();

    const rootContainer = getRootContainer();

    rootContainer.insertAdjacentHTML('afterbegin', headerMarkup);
    Array.from(rootContainer.querySelectorAll('.editable-svg')).map((img) => EditableSvg(img));
};

const removeHeader = () => {
    const rootContainer = getRootContainer();
    const header = rootContainer?.querySelector('header.site-header');

    if (header) {
        header.remove();
    }
};

const HeaderPreview = () => {
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
                insertHeader(headerMarkup);
            } else {
                removeHeader();
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
};

const HeaderPlugin = () => {
    const postType = useSelect((select) =>
        select('core/editor').getCurrentPostType(),
    );

    const isPost = postType === 'post';
    const isPage = postType === 'page';

    if (isPost || isPage) {
        return <HeaderPreview />;
    }

    return null;
};

registerPlugin('header-preview', {
    render: HeaderPlugin,
    icon: 'admin-generic',
});
