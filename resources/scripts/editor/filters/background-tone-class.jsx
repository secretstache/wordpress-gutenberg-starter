import { addFilter, removeFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import classNames from 'classnames';

export class BackgroundToneClassFilter {
    static BACKGROUND_TYPE = {
        COLOR: 'color',
        IMAGE: 'image',
        VIDEO: 'video',
    };

    name = 'ssm/background-color-class';
    isAdded = false;

    constructor(
        darkColors = [ 'black' ],
        postTypes = ['page', 'post', 'ssm_design_system', 'wp_block'],
    ) {
        this.darkColors = darkColors;
        this.postTypes = postTypes;
    }

    add() {
        addFilter(
            'editor.BlockListBlock',
            this.name,
            createHigherOrderComponent(
                (BlockListBlock) => {
                    return (props) => {
                        const { name: blockName, attributes } = props;

                        let backgroundType;
                        let backgroundColor;

                        if (blockName?.startsWith('ssm/')) {
                            backgroundType = attributes.backgroundType || this.constructor.BACKGROUND_TYPE.COLOR;
                            backgroundColor = attributes.backgroundColor?.slug;
                        } else {
                            backgroundType = this.constructor.BACKGROUND_TYPE.COLOR;
                            backgroundColor = attributes.backgroundColor || null;
                        }

                        const backgroundClass = this.constructor.getBackgroundToneClass(backgroundType, backgroundColor, this.darkColors);

                        return (
                            <BlockListBlock
                                {...props}
                                className={classNames(props.className, backgroundClass)}
                            />
                        );
                    };
                },
                this.name
            )
        );

        this.isAdded = true;
    }

    remove() {
        removeFilter('editor.BlockListBlock', this.name);
        this.isAdded = false;
    }

    static getBackgroundToneClass(backgroundType, backgroundColor, darkColors) {
        switch (backgroundType) {
            case this.BACKGROUND_TYPE.IMAGE:
            case this.BACKGROUND_TYPE.VIDEO:
                return 'bg-dark';

            case this.BACKGROUND_TYPE.COLOR:
                return backgroundColor
                    ? darkColors.includes(backgroundColor)
                        ? 'bg-dark'
                        : 'bg-light'
                    : '';

            default:
                return '';
        }
    }
}
