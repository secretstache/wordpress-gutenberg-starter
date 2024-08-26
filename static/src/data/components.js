const slugify = require('slugify');
const requireGlob = require('require-glob');

const isBlocks = process.env.project === 'blocks';

function convertComponent(cmp, componentType) {
    const component = { ...cmp };
    component.type = componentType;

    // Extract variants from component and remove them
    let { variants = [] } = component;
    delete component.variants;

    // Back out if the component isn't valid
    if (!component || !component.title) return null;

    // Set sensible defaults for previews & slugs
    component.preview = component.preview || 'default';
    const parentSlug = component.slug || slugify(component.title.toLowerCase());

    if (component.context.innerContent) {
        component.context.innerContent = `${componentType}s/${component.name}/context/${component.context.innerContent}.njk`;
    }
    // Loop the variants, returning a merged combo of component, then variant
    variants = variants.map((variant) => {
        const variantSlug = slugify(variant.title.toLowerCase());
        const preview = variant.preview ? variant.preview || 'default' : component.preview || 'default';

        if (variant.context.innerContent) {
            variant.context.innerContent = `${componentType}s/${component.name}/context/${variant.context.innerContent}.njk`;
        }

        return {
            ...component,
            ...variant,
            context: {
                ...variant.context,
            },
            variant: true,
            preview,
            originalTitle: variant.title,
            title: `${component.title} - ${variant.title}`,
            defaultTitle: variant.defaultTitle || '',
            slug: `${parentSlug}-${variantSlug}`,
        };
    });

    // Return the main component and any variants
    return [
        {
            slug: parentSlug,
            ...component,
        },
        ...variants,
    ];
}

function reducer(options, tr, fileObj) {
    const tree = { ...tr };
    if (!fileObj || fileObj.exports.hidden) return tree;
    if (tree.components === undefined) tree.components = [];
    const path = fileObj.path.replaceAll('\\', '/').split('/');
    tree.components.push({
        ...fileObj.exports,
        name: path[path.length - 2],
    });
    return tree;
}

function createMenu(groups) {
    const menu = groups.map((group) => {
        const [
            parent,
            ...variants
        ] = group;

        return {
            title: parent.title,
            defaultTitle: parent.defaultTitle,
            url: `/design-system/${parent.type}/${parent.slug}/`,
            children: variants?.map(({ originalTitle, slug, type }) => ({ title: originalTitle, url: `/design-system/${type}/${slug}/` })) || [],
        };
    });

    return menu.sort((a, b) => (a.title > b.title ? 1 : -1));
}
function prepareMenu(modulesGroups, templatesGroups) {
    const moduleMenu = createMenu(modulesGroups);

    const finalModuleMenu = [
        {
            title: 'Modules',
            url: '#',
            children: moduleMenu,
        },
    ];

    const templateMenu = createMenu(templatesGroups);

    const finaltemplateMenu = [
        {
            title: 'Templates',
            url: '#',
            children: templateMenu,
        },
    ];

    return finalModuleMenu.concat(finaltemplateMenu);
}

function prepareBlocksMenu(blocksGroups) {
    const blockMenu = createMenu(blocksGroups);

    const finalBlockMenu = [
        {
            title: 'Blocks',
            url: '#',
            children: blockMenu,
        },
    ];

    return finalBlockMenu;
}

module.exports = async function () {
    if (isBlocks) {
        // Pull in all the config files
        const blocks = await requireGlob('../partials/blocks/**/*.config.js', { reducer, bustCache: true });

        // Convert the components into our required format
        const blocksGroups = blocks.components
            .map((cmp) => {
                return convertComponent(cmp, 'block');
            })
            .filter(Boolean);

        // Return the components and the menu, broken down into categories
        return {
            components: blocksGroups.flat(),
            menu: prepareBlocksMenu(blocksGroups),
        };
    } else {
        const modules = await requireGlob('../partials/modules/**/*.config.js', { reducer, bustCache: true });
        const templates = await requireGlob('../partials/templates/**/*.config.js', { reducer, bustCache: true });

        // Convert the components into our required format
        const modulesGroups = modules.components
            .map((cmp) => {
                return convertComponent(cmp, 'module');
            })
            .filter(Boolean);
        const templatesGroups = templates.components
            .map((cmp) => {
                return convertComponent(cmp, 'template');
            })
            .filter(Boolean);

        // Return the components and the menu, broken down into categories
        return {
            components: modulesGroups.concat(templatesGroups).flat(),
            menu: prepareMenu(modulesGroups, templatesGroups),
        };
    }
};
