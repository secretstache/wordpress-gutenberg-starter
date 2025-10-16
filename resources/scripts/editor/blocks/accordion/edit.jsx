import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    RadioControl,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { useState, useRef, useEffect, useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { useDataQuery, ResourcesWrapper, DataQueryControls } from '@secretstache/wordpress-gutenberg';

import { DATA_SOURCE, POST_TYPE, QUERY_TYPE, TAXONOMY, AccordionContext } from './index.jsx';
import { FaqItem } from './components/FaqItem.jsx';

const ALLOWED_BLOCKS = ['ssm/accordion-item'];

const TEMPLATE = [
    ['ssm/accordion-item'],
    ['ssm/accordion-item'],
];

export const edit = ({ attributes, setAttributes, clientId }) => {
    const {
        isOpenedByDefault,
        dataSource,
        numberOfPosts,
        queryType,
        selectedCategories,
        curatedPosts,
    } = attributes;

    const [ activeItemClientId, setActiveItemClientId ] = useState(null);

    const blockRef = useRef(null);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), []);

    const isDataSourceNone = dataSource === DATA_SOURCE.NONE;
    const isDataSourceFaq = dataSource === DATA_SOURCE.FAQ;

    const isQueryTypeAll = queryType === QUERY_TYPE.LATEST;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;
    const isQueryTypeByCategory = queryType === QUERY_TYPE.BY_CATEGORY;

    const isEmptySelection = (isQueryTypeCurated && !curatedPosts?.length) || (isQueryTypeByCategory && !selectedCategories?.length);

    const queryConfig = useMemo(() => ({
        postType: POST_TYPE.FAQ,
        taxonomySlug: TAXONOMY.FAQ_CATEGORY,
        curatedTermsIds: isQueryTypeByCategory && selectedCategories,
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
        numberOfPosts: !isQueryTypeCurated ? numberOfPosts : -1,
        extraQueryArgs: (isQueryTypeAll || isQueryTypeByCategory) ? { order: 'asc', orderby: 'title' } : {},
    }), [ queryType, selectedCategories, curatedPosts, numberOfPosts ]);

    const { postsToShow, isResolving, isEmpty } = useDataQuery(
        isDataSourceFaq ? queryConfig : {},
        [ dataSource, queryType, selectedCategories, curatedPosts, numberOfPosts ],
    );

    useEffect(() => {
        if (isOpenedByDefault) {
            const firstItemId = childBlocks?.[0]?.clientId;
            setActiveItemClientId(firstItemId);
        } else {
            setActiveItemClientId(null);
        }
    }, [ isOpenedByDefault ]);

    const onOpenByDefaultChange = useCallback((isOpenedByDefault) => {
        setAttributes({ isOpenedByDefault });
    }, []);

    const onDataSourceChange = useCallback((dataSource) => {
        setAttributes({ dataSource });
    }, []);

    const blockProps = useBlockProps({
        className: classNames('flex flex-col gap-4', {
            'is-opened-by-default': isOpenedByDefault,
        }),
        ref: blockRef,
    });

    const innerBlocksProps = useInnerBlocksProps(
        blockProps,
        {
            allowedBlocks: ALLOWED_BLOCKS,
            template: TEMPLATE,
        },
    );

    return (
        <AccordionContext.Provider value={{
            activeItemClientId,
            setActiveItemClientId,
            dataSource,
        }}>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Initially opened"
                        checked={isOpenedByDefault}
                        onChange={onOpenByDefaultChange}
                    />

                    <Divider />

                    <RadioControl
                        label="Data Source"
                        selected={dataSource}
                        options={[
                            { label: 'None', value: DATA_SOURCE.NONE },
                            { label: 'FAQ', value: DATA_SOURCE.FAQ },
                        ]}
                        onChange={onDataSourceChange}
                    />

                    {isDataSourceFaq && (
                        <>
                            <Divider />

                            <DataQueryControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            >
                                <DataQueryControls.QueryType options={[
                                    { label: 'All', value: QUERY_TYPE.LATEST },
                                    { label: 'By Category', value: QUERY_TYPE.BY_CATEGORY },
                                    { label: 'Curated', value: QUERY_TYPE.CURATED },
                                ]} />

                                <DataQueryControls.CuratedPosts
                                    condition={isQueryTypeCurated}
                                    attributeName="curatedPosts"
                                    postType={POST_TYPE.FAQ}
                                    placeholder="FAQs to show"
                                />

                                <DataQueryControls.TaxonomySelect
                                    condition={isQueryTypeByCategory}
                                    attributeName="selectedCategories"
                                    taxonomy={TAXONOMY.FAQ_CATEGORY}
                                    value={selectedCategories}
                                />

                                <DataQueryControls.NumberOfPosts
                                    condition={!isQueryTypeCurated}
                                    attributeName="numberOfPosts"
                                    value={numberOfPosts}
                                />
                            </DataQueryControls>
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps}>
                {isDataSourceNone ? (
                    innerBlocksProps.children
                ) : (
                    <ResourcesWrapper
                        isLoading={isResolving}
                        isEmptyResources={isEmpty}
                        isEmptySelection={isEmptySelection}
                    >
                        {
                            postsToShow && postsToShow.length > 0 && (
                                postsToShow.map((post) => <FaqItem key={post.id} post={post} />)
                            )
                        }
                    </ResourcesWrapper>
                )}
            </div>
        </AccordionContext.Provider>
    );
};

