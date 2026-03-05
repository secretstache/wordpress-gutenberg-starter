import { useState, useCallback, useRef } from '@wordpress/element';

import { ICON_TYPES } from './icons.js';

export const useIconSelection = (attributes, setAttributes) => {
    const [ isModalOpen, setModalOpen ] = useState(false);
    const [ searchTerm, setSearchTerm ] = useState('');
    const searchRef = useRef(null);

    const openModal = useCallback(() => {
        setModalOpen(true);
        setTimeout(() => {
            searchRef.current?.focus();
        }, 0);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setSearchTerm('');
    }, []);

    const selectIcon = useCallback((icon) => {
        setAttributes({
            iconName: icon?.name || '',
            iconType: icon?.type || ICON_TYPES.FONT,
        });
        closeModal();
    }, [ closeModal ]);

    const removeIcon = useCallback(() => {
        setAttributes({ iconName: '', iconType: ICON_TYPES.FONT });
    }, []);

    const updateIconAttribute = useCallback((attribute, value) => {
        setAttributes({ [attribute]: value });
    }, []);

    return {
        isModalOpen,
        searchTerm,
        searchRef,
        openModal,
        closeModal,
        selectIcon,
        removeIcon,
        setSearchTerm,
        updateIconAttribute,
    };
};
