import { addFilter, removeFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

export const backgroundColorClassFilter = {
    add() {
        const darkColors = [
            'black',
            'black-soft',
            'black-dark',
            'blue-dark',
            'blue-darkest',
            'blue-deep',
            'blue-steel',
            'blue-sky',
            'blue-ocean',
            'blue-navy',
            'gray-darkest',
        ];

        const BACKGROUND_TYPE = {
            COLOR: 'color',
            IMAGE: 'image',
            VIDEO: 'video',
        };

        const getBackgroundClass = (backgroundType, backgroundColor) => {
            if (!backgroundType || !backgroundColor) {
                return '';
            }

            switch (backgroundType) {
                case BACKGROUND_TYPE.IMAGE:
                case BACKGROUND_TYPE.VIDEO:
                    return 'bg-dark';

                case BACKGROUND_TYPE.COLOR:
                    return darkColors.includes(backgroundColor) ? 'bg-dark' : 'bg-light';

                default:
                    return '';
            }
        };

        const withEditorBackgroundClass = createHigherOrderComponent((BlockListBlock) => {
            // eslint-disable-next-line react/display-name
            return (props) => {
                const { name: blockName, attributes } = props;

                let backgroundClass;

                if (blockName?.startsWith('ssm/')) {
                    const backgroundType = attributes.backgroundType || BACKGROUND_TYPE.COLOR;
                    const backgroundColorAttr = typeof attributes.backgroundColor === 'object'
                        ? attributes.backgroundColor?.slug
                        : attributes.backgroundColor;

                    const backgroundColor = backgroundColorAttr || 'white';

                    backgroundClass = getBackgroundClass(backgroundType, backgroundColor);
                } else {
                    const backgroundType = BACKGROUND_TYPE.COLOR;
                    const backgroundColor = attributes.backgroundColor || null;

                    backgroundClass = getBackgroundClass(backgroundType, backgroundColor);
                }

                if (!backgroundClass) {
                    return (<BlockListBlock {...props} />);
                }

                return (
                    <BlockListBlock {...props} className={backgroundClass} />
                );
            };
        }, 'withEditorBackgroundClass');

        addFilter(
            'editor.BlockListBlock',
            'ssm/with-editor-background-class',
            withEditorBackgroundClass,
        );
    },
    remove() {
        removeFilter('editor.BlockListBlock', 'ssm/background-color-class');
    },
};
