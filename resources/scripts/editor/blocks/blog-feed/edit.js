import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    PanelBody,
    BaseControl,
    __experimentalDivider as Divider,
    __experimentalVStack as VStack,
    RangeControl,
    RadioControl,
    CheckboxControl,
} from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { arrayMove } from 'react-sortable-hoc';
import Select from 'react-select';

import {
    SortableSelectAsync,
    loadSelectOptions,
    useDataQuery,
    ResourcesWrapper,
    decodeHtmlEntities,
} from '@secretstache/wordpress-gutenberg';

import { LAYOUT_TYPE, POST_TYPE, QUERY_TYPE } from './index.js';
import { PostsList } from './components/PostsList.js';

export const edit = ({ attributes, setAttributes }) => {
    const {
        queryType,
        selectedCategories,
        curatedPosts,
        numberOfPosts,
        layoutType,
        isShowFeaturedImage,
        isShowTitle,
        isShowPostMeta,
        columnsPerRow,
    } = attributes;

    const resourceCategories = useSelect((select) => {
        return select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 });
    }, []);

    const resourceCategoriesOptions = resourceCategories?.map(category => ({
        value: category.id,
        label: decodeHtmlEntities(category.name),
    })) || [];

    const loadResourcesOptions = useCallback(async (inputValue) => {
        return await loadSelectOptions(inputValue, POST_TYPE.RESOURCES);
    }, []);

    const [ defaultResourcesOptions, setDefaultResourcesOptions ] = useState([]);

    useEffect(() => {
        loadSelectOptions('', POST_TYPE.RESOURCES).then(setDefaultResourcesOptions);
    }, []);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newCuratedPosts = arrayMove(curatedPosts, oldIndex, newIndex);
        setAttributes({ curatedPosts: newCuratedPosts });
    };

    const onQueryTypeChange = useCallback((queryType) => setAttributes({
        queryType,
        selectedCategories: [],
        curatedPosts: [],
    }), []);

    const onCuratedPostsChange = useCallback((curatedPosts) => setAttributes({ curatedPosts }), []);

    const onLayoutTypeChange = useCallback((layoutType) => setAttributes({ layoutType }), []);

    const onResourcesCategoryChange = useCallback((selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setAttributes({ selectedCategories: selectedIds });
    }, []);

    const onNumberOfPostsChange = useCallback((numberOfPosts) => setAttributes({ numberOfPosts }), []);

    const onColumnsPerRowChange = useCallback((columnsPerRow) => setAttributes({ columnsPerRow }), []);

    const onIsShowFeaturedImageChange = useCallback((isShowFeaturedImage) => setAttributes({ isShowFeaturedImage }), []);

    const onIsShowTitleChange = useCallback((isShowTitle) => setAttributes({ isShowTitle }), []);

    const onIsShowPostMetaChange = useCallback((isShowPostMeta) => setAttributes({ isShowPostMeta }), []);

    const isQueryTypeAll = queryType === QUERY_TYPE.LATEST;
    const isQueryTypeByCategory = queryType === QUERY_TYPE.BY_CATEGORY;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;

    const isEmptySelection =
        (isQueryTypeCurated && !curatedPosts?.length) ||
        (isQueryTypeByCategory && !selectedCategories?.length);

    const {
        postsToShow,
        isResolving,
        isEmpty,
    } = useDataQuery({
        postType: 'post',
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post?.value),
        taxonomySlug: 'categories',
        curatedTermsIds: selectedCategories,
        numberOfPosts: isQueryTypeAll ? numberOfPosts : -1,
    }, [ queryType, selectedCategories, curatedPosts, numberOfPosts ]);

    const isBlockGrid = layoutType === 'block-grid';

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">

                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Block Grid', value: LAYOUT_TYPE.BLOCK_GRID },
                            { label: 'Stacked', value: LAYOUT_TYPE.STACKED },
                        ]}
                        onChange={onLayoutTypeChange}
                    />

                    {
                        isBlockGrid && (
                            <RangeControl
                                label="Columns Per Row"
                                value={columnsPerRow}
                                onChange={onColumnsPerRowChange}
                                min={2}
                                max={4}
                            />
                        )
                    }

                    <BaseControl
                        label="UI Elements"
                        __nextHasNoMarginBottom={true}
                    >
                        <VStack>
                            <CheckboxControl
                                label="Show Featured Image"
                                checked={isShowFeaturedImage}
                                onChange={onIsShowFeaturedImageChange}
                                __nextHasNoMarginBottom={true}
                            />

                            <CheckboxControl
                                label="Show Title"
                                checked={isShowTitle}
                                onChange={onIsShowTitleChange}
                                __nextHasNoMarginBottom={true}
                            />

                            <CheckboxControl
                                label="Show Post Meta"
                                checked={isShowPostMeta}
                                onChange={onIsShowPostMetaChange}
                                __nextHasNoMarginBottom={true}
                            />
                        </VStack>
                    </BaseControl>

                    <RadioControl
                        label="Query"
                        selected={queryType}
                        options={[
                            { label: 'Latest', value: QUERY_TYPE.LATEST },
                            { label: 'Latest by Category', value: QUERY_TYPE.BY_CATEGORY },
                            { label: 'Curated', value: QUERY_TYPE.CURATED },
                        ]}
                        onChange={onQueryTypeChange}
                    />

                    {
                        ( isQueryTypeCurated ) && (
                            <>
                                <Divider margin={2} />

                                <SortableSelectAsync
                                    onSortEnd={onSortEnd}
                                    value={curatedPosts}
                                    defaultOptions={defaultResourcesOptions}
                                    loadOptions={loadResourcesOptions}
                                    onChange={onCuratedPostsChange}
                                    placeholder="Resources to show"
                                />
                            </>
                        )
                    }

                    {
                        ( isQueryTypeByCategory ) && (
                            <>
                                <Divider margin={2} />

                                <Select
                                    isMulti
                                    options={resourceCategoriesOptions}
                                    value={selectedCategories?.map(id => resourceCategoriesOptions.find(option => option.value === id))}
                                    onChange={onResourcesCategoryChange}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Categories to show"
                                />

                            </>
                        )
                    }

                    {
                        ( isQueryTypeAll || isQueryTypeByCategory ) && (
                            <>
                                <Divider margin={2}/>

                                <RangeControl
                                    label="Number of Posts"
                                    value={numberOfPosts}
                                    onChange={onNumberOfPostsChange}
                                    min={-1}
                                    max={12}
                                    help="The maximum number of posts to show (-1 for no limit)"
                                />
                            </>
                        )
                    }

                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <ResourcesWrapper
                    isLoading={isResolving}
                    isEmptyResources={isEmpty}
                    isEmptySelection={isEmptySelection}
                >
                    <PostsList
                        posts={postsToShow}
                        layoutType={layoutType}
                        isShowFeaturedImage={isShowFeaturedImage}
                        isShowTitle={isShowTitle}
                        isShowPostMeta={isShowPostMeta}
                        columnsPerRow={columnsPerRow}
                        isBlockGrid={isBlockGrid}
                    />
                </ResourcesWrapper>
            </div>
        </>
    );
};
