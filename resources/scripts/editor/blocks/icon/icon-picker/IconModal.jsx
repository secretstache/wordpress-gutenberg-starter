import { Modal, SearchControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { IconDisplay } from './IconDisplay.jsx';
import { filterIconSets } from './icons.js';

export const IconModal = ({
    isOpen,
    onClose,
    onSelect,
    searchTerm,
    onSearchChange,
    searchRef,
    currentIconName = '',
    currentIconType = '',
}) => {
    const iconSets = useMemo(() => {
        return filterIconSets(searchTerm);
    }, [ searchTerm ]);

    if (!isOpen) return null;

    return (
        <Modal
            className="ssm-icon-modal"
            isFullScreen={true}
            title="Select Icon"
            onRequestClose={onClose}
        >
            <div className="ssm-icon-modal__search">
                <SearchControl
                    ref={searchRef}
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search icons..."
                />
            </div>

            {iconSets.length === 0 && (
                <p className="ssm-icon-modal__empty">No icons match that search.</p>
            )}

            {iconSets.map((set) => (
                <div
                    key={set.key}
                    className={`ssm-icon-modal__section ${set.key === 'custom' ? 'ssm-icon-modal__section--custom' : ''}`.trim()}
                >
                    <div className="ssm-icon-modal__section-title">
                        {set.label}
                    </div>

                    <div className="ssm-icon-modal__grid">
                        {set.icons.map((icon) => (
                            <div key={`${icon.type}-${icon.name}`} className="ssm-icon-modal__item">
                                <button
                                    onClick={() => onSelect(icon)}
                                    className={`ssm-icon-modal__button ${
                                        currentIconName === icon.name && currentIconType === icon.type
                                            ? 'is-active'
                                            : ''
                                    }`}
                                >
                                    <IconDisplay
                                        iconName={icon.name}
                                        iconType={icon.type}
                                        iconSize={30}
                                    />
                                </button>
                                <span className="ssm-icon-modal__label">
                                    {icon.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </Modal>
    );
};
