import { addFilter, removeFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import classNames from 'classnames';

export const backgroundColorClassFilter = {
    add() {
        const darkColors = [
            'black',
        ];

        const BACKGROUND_TYPE = {
            COLOR: 'color',
            IMAGE: 'image',
            VIDEO: 'video',
        };

        const getBackgroundClass = (backgroundType, backgroundColor) => {
            switch (backgroundType) {
                case BACKGROUND_TYPE.IMAGE:
                case BACKGROUND_TYPE.VIDEO:
                    return 'bg-dark';

                case BACKGROUND_TYPE.COLOR:
                    return backgroundColor
                        ? darkColors.includes(backgroundColor)
                            ? 'bg-dark'
                            : 'bg-light'
                        : '';

                default:
                    return '';
            }
        };

        const withEditorBackgroundClass = createHigherOrderComponent(
            (BlockListBlock) => {
                return (props) => {
                    const { name: blockName, attributes } = props;

                    let backgroundType;
                    let backgroundColor;

                    if (blockName?.startsWith('ssm/')) {
                        backgroundType = attributes.backgroundType || BACKGROUND_TYPE.COLOR;
                        backgroundColor = attributes.backgroundColor?.slug;
                    } else {
                        backgroundType = BACKGROUND_TYPE.COLOR;
                        backgroundColor = attributes.backgroundColor || null;
                    }

                    const backgroundClass = getBackgroundClass(backgroundType, backgroundColor);

                    return (
                        <BlockListBlock
                            {...props}
                            className={classNames(props.className, backgroundClass)}
                        />
                    );
                };
            },
            'withEditorBackgroundClass'
        );

        addFilter(
            'editor.BlockListBlock',
            'ssm/background-color-class',
            withEditorBackgroundClass
        );
    },

    remove() {
        removeFilter('editor.BlockListBlock', 'ssm/background-color-class');
    },
};
