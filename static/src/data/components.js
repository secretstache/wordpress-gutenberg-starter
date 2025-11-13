import { glob } from 'glob';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

    if (component.context?.innerContent) {
        component.context.innerContent = `blocks/${component.name}/context/${component.context.innerContent}.njk`;
    }

    // Loop the variants, returning a merged combo of component, then variant
    variants = variants?.map((variant) => {
        const variantSlug = slugify(variant.title.toLowerCase());
        const preview = variant.preview ? variant.preview || 'default' : component.preview || 'default';

        if (variant.context?.innerContent) {
            variant.context.innerContent = `blocks/${component.name}/context/${variant.context.innerContent}.njk`;
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
    }) || [];

    // Return the main component and any variants
    return [
        {
            slug: parentSlug,
            ...component,
        },
        ...variants,
    ];
}

function createMenu(groups) {
    if (!groups || groups.length === 0) return [];

    const menu = groups.map((group) => {
        const [
            parent,
            ...variants
        ] = group;

        return {
            title: parent.title,
            defaultTitle: parent.defaultTitle,
            url: `/design-system/${parent.type}/${parent.slug}/`,
            children: variants?.map(({ originalTitle, slug, type }) => ({
                title: originalTitle,
                url: `/design-system/${type}/${slug}/`
            })) || [],
        };
    });

    return menu.sort((a, b) => (a.title > b.title ? 1 : -1));
}

function prepareBlocksMenu(blocksGroups) {
    const blockMenu = createMenu(blocksGroups);

    const finalBlockMenu = blockMenu.length > 0 ? [
        {
            title: 'Blocks',
            url: '#',
            children: blockMenu,
        },
    ] : [];

    return finalBlockMenu;
}

async function loadComponents(pattern) {
    const files = await glob(pattern, {
        cwd: __dirname,
        absolute: false
    });


    const components = await Promise.all(
        files.map(async (file) => {
            try {
                // Create proper file URL for import
                const filePath = path.resolve(__dirname, file);
                const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;

                // Import the module with cache busting
                const module = await import(`${fileUrl}?update=${Date.now()}`);

                // Get the default export
                const exports = module.default || module;

                // Skip hidden components
                if (exports.hidden) {
                    return null;
                }

                // Extract component name from path
                const pathParts = file.replaceAll('\\', '/').split('/');
                const name = pathParts[pathParts.length - 2];

                return {
                    ...exports,
                    name,
                };
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error);

                return null;
            }
        })
    );

    return components.filter(Boolean);
}

export default async function () {
    // Blocks are located at static/src/partials/blocks/
    // From static/src/data, that's ../partials/blocks/
    const blocks = await loadComponents('../partials/blocks/**/*.config.js');

    const blocksGroups = blocks
        .map((cmp) => convertComponent(cmp, 'block'))
        .filter(Boolean);

    const result = {
        components: blocksGroups.flat(),
        menu: prepareBlocksMenu(blocksGroups),
    };

    return result;
}
