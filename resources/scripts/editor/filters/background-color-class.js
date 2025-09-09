import { addFilter, removeFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

export const backgroundColorClassFilter = {
    add() {
        const darkColors = [
            'black',
        ];

        const lightColors = [
            'white',
        ];

        const BACKGROUND_TYPE = {
            COLOR: 'color',
            GRADIENT: 'gradient',
            IMAGE: 'image',
            VIDEO: 'video',
        };

        const addBackgroundClass= (backgroundColor) => {
            if (!backgroundColor) {
                return;
            }

            return [
                darkColors.includes(backgroundColor) ? 'bg-dark' : '',
                lightColors.includes(backgroundColor) ? 'bg-light' : '',
            ].join(' ').trim();
        };

        const withEditorBackgroundClass = createHigherOrderComponent((BlockListBlock) => {
            // eslint-disable-next-line react/display-name
            return (props) => {
                if (!props.attributes.backgroundColor) {
                    return (<BlockListBlock {...props} />);
                }

                const backgroundType = typeof props.attributes.backgroundType === 'object'
                    ? props.attributes.backgroundType
                    : BACKGROUND_TYPE.COLOR;

                const backgroundColor = typeof props.attributes.backgroundColor === 'object'
                    ? props.attributes.backgroundColor?.slug
                    : props.attributes.backgroundColor;

                const backgroundClass = backgroundType === BACKGROUND_TYPE.COLOR ? addBackgroundClass(backgroundColor) : '';

                return (
                    <BlockListBlock {...props} className={backgroundClass} />
                );
            };
        }, 'withEditorBackgroundClass' );

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
