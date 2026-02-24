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
import { useDataQuery, ResourcesWrapper, DataQueryControls } from '@secretstache/wordpress-gutenberg';

import { AccordionContext } from './index.jsx';
import { FaqItem } from './components/FaqItem.jsx';

const ALLOWED_BLOCKS = ['ssm/accordion-item'];

const TEMPLATE = [
    ['ssm/accordion-item', {}, [ ['core/paragraph'] ]],
    ['ssm/accordion-item', {}, [ ['core/paragraph'] ]],
];

export const TAXONOMY = {
    FAQ_CATEGORY: 'ssm_faq_category',
};

export const POST_TYPE = {
    FAQ: 'ssm_faq',
};

export const DATA_SOURCE = {
    NONE: 'none',
    FAQ: 'faq',
};

export const QUERY_TYPE = {
    ALL: 'all',
    BY_CATEGORY: 'by_faq_category',
    CURATED: 'curated',
};

export const edit = ({ attributes, setAttributes, clientId }) => {
    const {
        isOpenedByDefault,
        isAllowedMultiple,
        dataSource,
        numberOfPosts,
        queryType,
        curatedTerms,
        curatedPosts,
    } = attributes;

    const [ activeItemClientId, setActiveItemClientId ] = useState(null);

    const blockRef = useRef(null);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), []);

    const isDataSourceNone = dataSource === DATA_SOURCE.NONE;
    const isDataSourceFaq = dataSource === DATA_SOURCE.FAQ;

    const isQueryTypeAll = queryType === QUERY_TYPE.ALL;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;
    const isQueryTypeByCategory = queryType === QUERY_TYPE.BY_CATEGORY;

    const isEmptySelection = (isQueryTypeCurated && !curatedPosts?.length) || (isQueryTypeByCategory && !curatedTerms?.length);

    const queryConfig = useMemo(() => ({
        postType: POST_TYPE.FAQ,
        taxonomySlug: TAXONOMY.FAQ_CATEGORY,
        curatedTermsIds: isQueryTypeByCategory ? curatedTerms : null,
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
        numberOfPosts: !isQueryTypeCurated ? numberOfPosts : -1,
        extraQueryArgs: (isQueryTypeAll || isQueryTypeByCategory) ? { order: 'asc', orderby: 'title' } : {},
    }), [ queryType, curatedTerms, curatedPosts, numberOfPosts ]);

    const { postsToShow, isResolving, isEmpty } = useDataQuery(
        isDataSourceFaq ? queryConfig : {},
        [ dataSource, queryType, curatedTerms, curatedPosts, numberOfPosts ],
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

    const onAllowMultipleChange = useCallback((isAllowedMultiple) => {
        setAttributes({ isAllowedMultiple });
    }, []);

    const onDataSourceChange = useCallback((dataSource) => {
        setAttributes({ dataSource });
    }, []);

    const blockProps = useBlockProps({
        className: 'h-full flex flex-col',
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
            isAllowedMultiple,
            isOpenedByDefault,
        }}>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ToggleControl
                        label="Initially opened"
                        checked={isOpenedByDefault}
                        onChange={onOpenByDefaultChange}
                    />

                    <ToggleControl
                        label="Allow multiple"
                        checked={isAllowedMultiple}
                        onChange={onAllowMultipleChange}
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
                                    { label: 'All', value: QUERY_TYPE.ALL },
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
                                    attributeName="curatedTerms"
                                    taxonomy={TAXONOMY.FAQ_CATEGORY}
                                    value={curatedTerms}
                                />

                                <DataQueryControls.NumberOfPosts
                                    condition={!isQueryTypeCurated}
                                    attributeName="numberOfPosts"
                                    value={numberOfPosts}
                                    hasDivider={false}
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
                                postsToShow.map((post, index) => <FaqItem
                                    key={post.id}
                                    post={post}
                                    position={index}
                                />)
                            )
                        }
                    </ResourcesWrapper>
                )}
            </div>
        </AccordionContext.Provider>
    );
};
