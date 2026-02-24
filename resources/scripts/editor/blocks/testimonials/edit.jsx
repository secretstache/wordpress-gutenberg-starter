import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useMemo, useRef, useEffect } from '@wordpress/element';
import { ResourcesWrapper, DataQueryControls, useDataQuery } from '@secretstache/wordpress-gutenberg';

import { Testimonial } from './components/Testimonial.jsx';

const initTestimonials = () => {
    console.log('initTestimonials');
};

const QUERY_TYPE = {
  ALL: 'all',
  CURATED: 'curated',
};

const POST_TYPE = { TESTIMONIAL: 'ssm_testimonial' };

export const edit = ({ attributes, setAttributes }) => {
    const {
        queryType,
        curatedPosts,
        numberOfPosts,
    } = attributes;

    const isQueryTypeAll = queryType === QUERY_TYPE.ALL;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;

    const isEmptySelection = isQueryTypeCurated && !curatedPosts?.length;

    const queryConfig = useMemo(() => ({
        postType: POST_TYPE.TESTIMONIAL,
        curatedPostsIds: isQueryTypeCurated ? curatedPosts?.map((post) => post.value) : undefined,
        numberOfPosts: isQueryTypeCurated ? -1 : numberOfPosts,
        extraQueryArgs: isQueryTypeAll ? { order: 'asc', orderby: 'title' } : {},
    }), [ queryType, curatedPosts, numberOfPosts ]);

    const { postsToShow, isResolving, isEmpty } = useDataQuery(
        queryConfig,
        [ queryType, curatedPosts, numberOfPosts ],
    );

    const blockRef = useRef(null);
    const sliderInstance = useRef(null);

    useEffect(() => {
        if (postsToShow?.length > 0 && !isResolving && !isEmpty && blockRef?.current && !sliderInstance.current) {
            sliderInstance.current = initTestimonials(blockRef.current);
        }

        return () => {
            if (sliderInstance.current) {
                sliderInstance.current?.destroy();
                sliderInstance.current = null;
            }
        };
    }, [ postsToShow, isResolving, isEmpty, blockRef ]);

    const blockProps = useBlockProps({
        ref: blockRef,
    });

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
                                { label: 'All', value: QUERY_TYPE.ALL },
                                { label: 'Curated', value: QUERY_TYPE.CURATED },
                            ]}
                        />

                        <DataQueryControls.CuratedPosts
                            condition={isQueryTypeCurated}
                            attributeName="curatedPosts"
                            postType={POST_TYPE.TESTIMONIAL}
                            placeholder="Testimonials to show"
                        />

                        <DataQueryControls.NumberOfPosts
                            condition={!isQueryTypeCurated}
                            attributeName="numberOfPosts"
                            hasDivider={false}
                        />
                    </DataQueryControls>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <ResourcesWrapper
                    isLoading={isResolving}
                    isEmptyResources={isEmpty}
                    isEmptySelection={isEmptySelection}
                >
                    <div className="splide" role="group" aria-label="Tesimonials">
                        <div className="splide__track">
                            <div className="splide__list">
                                {postsToShow?.map((testimonial) => <Testimonial key={testimonial.id} testimonial={testimonial} />)}
                            </div>
                        </div>
                    </div>
                </ResourcesWrapper>
            </div>
        </>
    );
};
