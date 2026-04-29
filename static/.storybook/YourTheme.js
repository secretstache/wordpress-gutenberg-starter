import { create } from 'storybook/theming';

const isStaging = globalThis.location?.hostname !== 'localhost';

export default create({
    base: 'dark',
    brandTitle: 'Foothills Storybook',
    brandUrl: isStaging ? 'https://grdfrhstaging.wpenginepowered.com/static/' : 'http://localhost:5173/',
    brandImage: isStaging ? '/static/assets/images/cms/placeholder-logo.svg' : '/assets/images/cms/placeholder-logo.svg',
    brandTarget: '_blank',
});
