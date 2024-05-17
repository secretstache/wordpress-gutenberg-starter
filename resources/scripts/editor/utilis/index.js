import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import slugify from 'slugify';

export const loadSelectOptions = async (inputValue, postType, mapper = null ) => {
    const response = await apiFetch({
        path: `/wp/v2/${postType}?search=${encodeURIComponent(inputValue)}`,
    });

    if (mapper) {
        return response?.map(mapper);
    } else {
        return response?.map((post) => {
            // Create a temporary DOM element to decode HTML entities
            const tempElement = document.createElement('div');
            tempElement.innerHTML = post?.title?.rendered;

            return {
                value: post.id,
                label: tempElement.textContent || tempElement.innerText || '',
            };
        });
    }
};

/**
 * Hook to find a parent block of a specific type, optionally scoped within a certain root block.
 *
 * @param {string} selectedBlockId - The clientId of the currently selected block.
 * @param {string} parentBlockName - The block type name to search for as a parent.
 * @param {Object} options - Optional settings for the search.
 * @param {string} [options.rootBlockId] - The clientId of the block to limit the search within. If not provided, searches the entire block tree.
 * @param {boolean} [options.includeSelf] - Whether to include the selected block itself if it matches the parentBlockName.
 * @returns {Object|null} The matching parent block, or null if none is found.
 */
export const useParentBlock = (selectedBlockId, parentBlockName, options = {}) => {
    return useSelect((select) => {
        const { getBlock, getBlockRootClientId, getBlockHierarchyRootClientId } = select('core/block-editor');

        if (!selectedBlockId) {
            return null;
        }

        // Destructure with default values to handle optional parameters.
        const { rootBlockId = '', includeSelf = false } = options;

        // If rootBlockId is provided, verify the selected block is within its scope.
        if (rootBlockId) {
            const hierarchyRootClientId = getBlockHierarchyRootClientId(selectedBlockId);
            if (hierarchyRootClientId !== rootBlockId) {
                return null; // The selected block is out of the scope of the root block.
            }
        }

        let currentBlockId = selectedBlockId;
        let currentBlock = getBlock(currentBlockId);

        // Optionally include the selected block if it matches the target type.
        if (includeSelf && currentBlock?.name === parentBlockName) {
            return currentBlock;
        }

        let parentBlockId = getBlockRootClientId(currentBlockId);
        let parentBlock = getBlock(parentBlockId);

        // Traverse up the hierarchy to find the target parent block.
        while (parentBlock && (rootBlockId ? parentBlockId !== rootBlockId : true) && parentBlockId) {
            if (parentBlock.name === parentBlockName) {
                return parentBlock; // Target parent found.
            }
            currentBlockId = parentBlockId;
            parentBlockId = getBlockRootClientId(currentBlockId);
            parentBlock = getBlock(parentBlockId);
        }

        return null; // No matching parent found within the constraints.
    }, [selectedBlockId, parentBlockName, options.rootBlockId, options.includeSelf]);
};

export const getSlug = (name) => slugify(name, {
    replacement: '-',
    lower: true,
    strict: true,
});

export const cleanSvgString = (svgString) => {
    if (svgString.startsWith('<?xml')) {
        const endOfXml = svgString.indexOf('?>');

        if (endOfXml !== -1) {
            svgString = svgString.substring(endOfXml + 2);
        }
    }

    svgString = svgString.trim();

    return svgString;
};


const SVG_MIME_TYPE = 'image/svg+xml';

export const getImage = async (mediaData) => {
    const isSvg = mediaData?.mime === SVG_MIME_TYPE || mediaData?.mime_type === SVG_MIME_TYPE;
    const imagePayload = {
        isSvg,
        imageUrl: null,
        svgCode: null,
        width: mediaData?.width,
        height: mediaData?.height,
    };

    if (isSvg) {
        imagePayload.svgCode = await fetch(mediaData.url).then(response => response.text()).then(cleanSvgString);
    } else {
        imagePayload.imageUrl = mediaData?.url;
    }

    return imagePayload;
};

export const getPhoneNumber = (phone) => {
    if (!phone) return '';

    let formatted = phone;

    const pattern = /^\+\d(\d{3})(\d{3})(\d{4})$/;
    const match = phone.match(pattern);

    if (match) {
        formatted = `${match[1]}-${match[2]}-${match[3]}`;
    }

    return formatted;
};

export const getLocationAddress = (location) => {
    const {
        street_number = '',
        street_name = '',
        city = '',
        state_short = '',
        post_code = '',
    } = location;

    // Start with the street number and name, trimming to remove extra spaces if one is missing
    let addressParts = [`${street_number} ${street_name}`.trim()];

    // Add the city with a line break, but only if there is a city name.
    if (city) {
        addressParts.push(`<br>${city}`);
    }

    // Combine state and postal code intelligently, adding only if they exist
    let statePostalParts = [];
    if (state_short) statePostalParts.push(state_short);
    if (post_code) statePostalParts.push(post_code);
    let statePostal = statePostalParts.join(' ');

    if (statePostal) {
        // Add a comma only if there's something before this part
        addressParts.push(`${addressParts.length > 0 ? ', ' : ''}${statePostal}`);
    }

    return addressParts.join('');
};
