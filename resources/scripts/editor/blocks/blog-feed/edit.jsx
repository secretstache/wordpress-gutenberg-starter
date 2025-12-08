import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { ResourcesWrapper, DataQueryControls, useDataQuery } from '@secretstache/wordpress-gutenberg';

const QUERY_TYPE = {
    LATEST: 'latest',
    BY_CATEGORY: 'by_category',
    CURATED: 'curated',
};

const POST_TYPE = { POST: 'post' };

const TAXONOMY = { CATEGORY: 'categories' };

export const edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();

    const {
        queryType,
        curatedTerms,
        curatedPosts,
        numberOfPosts,
        isShowFilters
    } = attributes;

    const isQueryTypeAll = queryType === QUERY_TYPE.LATEST;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;
    const isQueryTypeByCategory = queryType === QUERY_TYPE.BY_CATEGORY;

    const isEmptySelection = (isQueryTypeCurated && !curatedPosts?.length) || (isQueryTypeByCategory && !curatedTerms?.length);

    const currentPostID = select('core/editor').getCurrentPostId();

    const queryConfig = useMemo(() => ({
        postType: POST_TYPE.POST,
        taxonomySlug: TAXONOMY.CATEGORY,
        curatedTermsIds: isQueryTypeByCategory && curatedTerms,
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
        numberOfPosts: !isQueryTypeCurated ? numberOfPosts : -1,
        extraQueryArgs: (isQueryTypeAll || isQueryTypeByCategory) ? { order: 'asc', orderby: 'title', exclude: currentPostID } : {},
    }), [ queryType, curatedTerms, curatedPosts, numberOfPosts ]);

    const { postsToShow, isResolving, isEmpty } = useDataQuery(queryConfig, [ queryType, curatedTerms, curatedPosts, numberOfPosts ]);

    const onIsShowFiltersChange = () => setAttributes({ isShowFilters: !isShowFilters })

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <DataQueryControls
                        attributes={attributes}
                        setAttributes={setAttributes}
                    >
                        <DataQueryControls.QueryType
                            attributeName="queryType"
                            options={[
                                { label: 'Latest', value: QUERY_TYPE.LATEST },
                                { label: 'Latest by Category', value: QUERY_TYPE.BY_CATEGORY },
                                { label: 'Curated', value: QUERY_TYPE.CURATED },
                            ]} />

                        <DataQueryControls.TaxonomySelect
                            condition={isQueryTypeByCategory}
                            attributeName="curatedTerms"
                            placeholder="Categories to show"
                            taxonomy={TAXONOMY.CATEGORY}
                        />

                        <DataQueryControls.CuratedPosts
                            condition={isQueryTypeCurated}
                            attributeName="curatedPosts"
                            postType={POST_TYPE.POST}
                        />

                        <DataQueryControls.NumberOfPosts
                            condition={!isQueryTypeCurated}
                            attributeName="numberOfPosts"
                        />
                    </DataQueryControls>

                    <ToggleControl
                        label="Include Filters"
                        checked={isShowFilters}
                        onChange={onIsShowFiltersChange}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <ResourcesWrapper
                    isLoading={isResolving}
                    isEmptyResources={isEmpty}
                    isEmptySelection={isEmptySelection}
                >
                    <ul>
                        {
                            postsToShow?.map((post) => (
                                <li key={post.id}>{post.title?.rendered}</li>
                            ))
                        }
                    </ul>
                </ResourcesWrapper>
            </div>
        </>
    );
}
