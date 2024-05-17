import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import {
    PanelBody,
    RadioControl,
    RangeControl,
    Spinner,
    Notice,
    __experimentalDivider as Divider,
    BaseControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState, useRef } from '@wordpress/element';
import Select from 'react-select';
import { arrayMove } from 'react-sortable-hoc';
import classNames from 'classnames';

import { loadSelectOptions } from '../../utilis/index.js';
import { SortableSelectAsync } from '../../components/controls/SortableSelectAsync.js';
import { DATA_SOURCES, POST_TYPES, QUERY_TYPES } from './index.js';

export const edit = ({ attributes, setAttributes }) => {
    const {
        title,
        dataSource,
        queryType,
        numberOfPosts,
        curatedPosts,
        selectedCategories,
    } = attributes;

    const blockRef = useRef(null);
    const [defaultNewsOptions, setDefaultNewsOptions] = useState([]);
    const [defaultResourcesOptions, setDefaultResourcesOptions] = useState([]);

    useEffect(() => {
        loadSelectOptions('', POST_TYPES.NEWS).then(setDefaultNewsOptions);
        loadSelectOptions('', POST_TYPES.RESOURCES).then(setDefaultResourcesOptions);
    }, []);

    const loadNewsOptions = useCallback(async (inputValue) => {
        return await loadSelectOptions(inputValue, POST_TYPES.NEWS);
    }, []);

    const loadResourcesOptions = useCallback(async (inputValue) => {
        return await loadSelectOptions(inputValue, POST_TYPES.RESOURCES);
    }, []);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newCuratedPosts = arrayMove(curatedPosts, oldIndex, newIndex);
        setAttributes({ curatedPosts: newCuratedPosts });
    };

    const categoriesOptions = useSelect((select) => {
        const taxonomySlug = dataSource === DATA_SOURCES.NEWS ? POST_TYPES.NEWS_CATEGORIES : POST_TYPES.RESOURCES_CATEGORIES;
        const categories = select('core').getEntityRecords('taxonomy', taxonomySlug, { per_page: -1 });

        return categories?.map((category) => {
            const tempElement = document.createElement('div');
            tempElement.innerHTML = category?.name;

            return {
                value: category.id,
                label: tempElement.textContent || tempElement.innerText || '',
            };
        });
    }, [dataSource, queryType]);

    const {
        postsToShow,
        isLoading,
    } = useSelect((select) => {
        const queryArgs = {
            order: 'desc',
            orderby: 'date',
            _embed: true,
        };

        const isUseNumberOfPosts = queryType !== QUERY_TYPES.CURATED;

        if (isUseNumberOfPosts) {
            queryArgs['per_page'] = numberOfPosts;
        }

        if (queryType === QUERY_TYPES.LATEST_BY_CATEGORY && selectedCategories.length) {
            queryArgs['categories'] = selectedCategories.join(',');
        } else if (queryType === QUERY_TYPES.CURATED && curatedPosts.length > 0) {
            queryArgs['include'] = curatedPosts.map((post) => post.value);
            queryArgs['orderby'] = 'include';
        }

        const postType = dataSource === DATA_SOURCES.NEWS ? POST_TYPES.NEWS : 'post';

        let postsToShow = select('core').getEntityRecords('postType', postType, queryArgs);

        const isResolving = select('core/data').isResolving('core', 'getEntityRecords', ['postType', postType, queryArgs]);
        const isLoading = isResolving || postsToShow === undefined;

        return {
            postsToShow,
            isLoading,
        };
    }, [dataSource, queryType, curatedPosts, selectedCategories, numberOfPosts]);

    useEffect(() => {
        if (postsToShow?.length && blockRef.current) {
           // ContentFeed();
        }
    }, [postsToShow, isLoading]);

    const onDataSourceChange = (dataSource) => setAttributes({
        dataSource,
        curatedPosts: [],
        selectedCategories: [],
    });

    const onCategoriesChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setAttributes({ selectedCategories: selectedIds });
    };

    const onTitleChange = (title) => {
        setAttributes({ title });
    };

    const isNews = dataSource === DATA_SOURCES.NEWS;
    const isResources = dataSource === DATA_SOURCES.RESOURCES;
    const isEmpty = postsToShow !== null && postsToShow?.length === 0;

    const className = classNames({
        'is-loading': isLoading,
        'is-empty': isEmpty,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Data Source"
                        selected={dataSource}
                        options={[
                            { label: 'News', value: DATA_SOURCES.NEWS },
                            { label: 'Resources', value: DATA_SOURCES.RESOURCES },
                        ]}
                        onChange={onDataSourceChange}
                    />

                    <Divider margin={2} />

                    { 
                        // Query Radio
                    }

                    <RadioControl
                        label="Query"
                        selected={queryType}
                        options={[
                            { label: 'Latest', value: QUERY_TYPES.LATEST },
                            { label: 'Latest by Category', value: QUERY_TYPES.LATEST_BY_CATEGORY },    
                            { label: 'Curated', value: QUERY_TYPES.CURATED },
                        ]}
                        onChange={(queryType) => setAttributes({ queryType })}
                    />

                    {
                        //Curated posts selects
                    }

                    {
                        isNews && queryType === QUERY_TYPES.CURATED && (
                            <>
                                <Divider margin={2} />

                                <SortableSelectAsync
                                    onSortEnd={onSortEnd}
                                    value={curatedPosts}
                                    defaultOptions={defaultNewsOptions}
                                    loadOptions={loadNewsOptions}
                                    onChange={(curatedPosts) => setAttributes({ curatedPosts })}
                                    placeholder="News to show"
                                />
                            </>
                        )
                    }

                    {
                        isResources && queryType === QUERY_TYPES.CURATED && (
                            <>
                                <Divider margin={2} />

                                <SortableSelectAsync
                                    onSortEnd={onSortEnd}
                                    value={curatedPosts}
                                    defaultOptions={defaultResourcesOptions}
                                    loadOptions={loadResourcesOptions}
                                    onChange={(curatedPosts) => setAttributes({ curatedPosts })}
                                    placeholder="Resources to show"
                                />
                            </>


                        )
                    }

                    {
                        //Taxonomy selects
                    }

                    {
                        isResources && queryType === QUERY_TYPES.LATEST_BY_CATEGORY && (
                            <>
                                <Divider margin={2} />

                                <BaseControl label="Categories to Show">
                                    <Select
                                        isMulti
                                        options={categoriesOptions}
                                        value={selectedCategories?.map(id => categoriesOptions?.find(option => option.value === id))}
                                        onChange={(newSelectedCategories) => onCategoriesChange(newSelectedCategories)}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </BaseControl>
                            </>
                        )
                    }

                    {
                        isNews && queryType === QUERY_TYPES.LATEST_BY_CATEGORY && (
                            <>
                                <Divider margin={2} />

                                <BaseControl label="Categories to Show">
                                    <Select
                                        isMulti
                                        options={categoriesOptions}
                                        value={selectedCategories?.map(id => categoriesOptions?.find(option => option.value === id))}
                                        onChange={(newSelectedCategories) => onCategoriesChange(newSelectedCategories)}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </BaseControl>
                            </>
                        )
                    }

                    {
                        //Number of posts control
                    }

                    {
                        queryType !== QUERY_TYPES.CURATED && (
                            <>
                                <Divider margin={2} />

                                <RangeControl
                                    label="Number of Posts"
                                    value={numberOfPosts}
                                    onChange={(numberOfPosts) => setAttributes({ numberOfPosts })}
                                    min={-1}
                                    max={12}
                                    help="The maximum number of posts to show (-1 for no limit)"
                                />
                            </>
                        )
                    }
                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps({ className })} >
                {
                    isLoading ? (
                        <Spinner className="bc-spinner" />
                    ) : (
                        isEmpty ? (
                            <Notice
                                status="info"
                                isDismissible={false}
                            >
                                <p>No resources were found matching your criteria. Please try to adjust the query.</p>
                            </Notice>
                        ) : (
                            <>
                                <div className="wp-block-ssm-content-feed__headline-block">
                                    <RichText
                                        tagName="h2"
                                        className="wp-block-heading is-style-line"
                                        value={title}
                                        onChange={onTitleChange}
                                        placeholder="Title"
                                    />
                                </div>

                                <div className="splide" ref={blockRef}>
                                    <div className="splide__track">
                                        <div className="splide__list">
                                            {postsToShow?.map((post) => {
                                                const link = post?.link || '#';

                                                return (
                                                    <div key={post.id} className="splide__slide">
                                                        <a
                                                            href={link}
                                                            key={post.id}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="wp-block-ssm-content-feed__item"
                                                        >
                                                           

                                                            <div className="wp-block-ssm-content-feed__content">
                                                                <h5
                                                                    className="wp-block-ssm-content-feed__title"
                                                                    dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
                                                                />
                                                            </div>
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )
                }
            </div>
        </>
    );
};
