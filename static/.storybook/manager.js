import { addons } from 'storybook/manager-api';
import YourTheme from './YourTheme';

addons.setConfig({
    theme: YourTheme,
    layoutCustomisations: {
        showPanel: (state, defaultValue) => {
            if (state.storyId?.startsWith('design-tokens')) {
                return false;
            }
            return defaultValue;
        },
    },
});
