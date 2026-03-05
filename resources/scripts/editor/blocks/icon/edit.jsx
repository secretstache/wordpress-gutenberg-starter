import {
    InspectorControls,
    useBlockProps,
    BlockControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    RangeControl,
    ToolbarButton,
    Placeholder,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { useState, useRef, useCallback } from '@wordpress/element';
import { replace, image } from '@wordpress/icons';

import { ColorPaletteControl } from '@secretstache/wordpress-gutenberg';

import { IconModal } from './icon-picker/IconModal.jsx';
import { ICON_TYPES } from './icon-picker/icons.js';

import { getIconData, getSizes, ICON_BG_DEFAULT, ICON_COLOR_DEFAULT } from './utils.js';

export const edit = ({ attributes, setAttributes }) => {
    const {
        iconName = '',
        iconType = ICON_TYPES.FONT,
        align = 'left',
        iconColor,
        iconBgColor,
        iconSize = 24,
    } = attributes;

    const [ isOpen, setOpen ] = useState(false);
    const [ searchTerm, setSearchTerm ] = useState('');
    const searchRef = useRef(null);

    const openModal = useCallback(() => {
        setOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
    }, []);

    const closeModal = useCallback(() => {
        setOpen(false);
        setSearchTerm('');
    }, []);

    const onSelectIcon = useCallback((icon) => {
        setAttributes({
            iconName: icon?.name || '',
            iconType: icon?.type || ICON_TYPES.FONT,
        });
        closeModal();
    }, [ closeModal, setAttributes ]);

    const alignMap = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };

    const blockProps = useBlockProps({
        className: `flex ${alignMap[align] || 'justify-start'}`,
    });

    const icon = getIconData(iconType, iconName);
    const sizes = getSizes(iconSize);

    const tileStyle = {
        '--icon-bg': iconBgColor?.value || ICON_BG_DEFAULT,
        '--icon-color': iconColor?.value || ICON_COLOR_DEFAULT,
        'width': `${sizes.containerPx}px`,
        'height': `${sizes.containerPx}px`,
        'minWidth': `${sizes.containerPx}px`,
    };

    const iconGlyph = icon && (icon.type === ICON_TYPES.CUSTOM ? (
        <div
            className="mask-contain mask-no-repeat bg-[var(--icon-color)]"
            style={{
                width: `${sizes.iconPx}px`,
                height: `${sizes.iconPx}px`,
                WebkitMaskImage: `url(${icon.url})`,
                maskImage: `url(${icon.url})`,
            }}
        />
    ) : (
        <span
            className={icon.className || ''}
            style={{ fontSize: `${sizes.iconPx}px`, lineHeight: 1, display: 'inline-block', color: 'var(--icon-color)' }}
            aria-hidden="true"
        />
    ));

    const iconTile = icon && (
        <div
            className="rounded-lg flex items-center justify-center border border-mist bg-[var(--icon-bg)]"
            style={tileStyle}
        >
            {iconGlyph}
        </div>
    );

    return (
        <>
            <BlockControls>
                <ToolbarButton
                    icon={replace}
                    label={iconName ? 'Change icon' : 'Choose icon'}
                    onClick={openModal}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody title="Icon Settings">
                    <Button variant="secondary" onClick={openModal}>
                        {iconName ? 'Change Icon' : 'Choose Icon'}
                    </Button>

                    <Divider />

                    <RangeControl
                        label="Size (px)"
                        value={iconSize}
                        onChange={(value) => setAttributes({ iconSize: value })}
                        min={12}
                        max={128}
                        step={2}
                    />

                    <ColorPaletteControl
                        label="Icon Color"
                        value={iconColor?.value}
                        attributeName="iconColor"
                        setAttributes={setAttributes}
                    />

                    <ColorPaletteControl
                        label="Tile Background"
                        value={iconBgColor?.value}
                        attributeName="iconBgColor"
                        setAttributes={setAttributes}
                    />
                </PanelBody>
            </InspectorControls>

            {icon ? (
                <div {...blockProps}>
                    {iconTile}
                </div>
            ) : (
                <div {...blockProps}>
                    <Placeholder icon={image} label="Icon">
                        <Button variant="primary" onClick={openModal}>
                            Choose Icon
                        </Button>
                    </Placeholder>
                </div>
            )}

            <IconModal
                isOpen={isOpen}
                onClose={closeModal}
                onSelect={onSelectIcon}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchRef={searchRef}
                currentIconName={iconName}
                currentIconType={iconType}
            />
        </>
    );
};
