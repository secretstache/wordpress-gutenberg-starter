import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useCallback, useRef } from '@wordpress/element';
import { PanelBody, RadioControl, RangeControl } from '@wordpress/components';
import { arrayMove } from 'react-sortable-hoc';
import classNames from 'classnames';
import {
    SortableSelectAsync,
    ResourcesWrapper,
    loadSelectOptions,
    useDataQuery,
    useSlider,
    decodeHtmlEntities,
    ColorPaletteControl,
} from '@secretstache/wordpress-gutenberg';

import { POST_TYPE, LAYOUT_TYPE, QUERY_TYPE } from './index.js';
import { TestimonialItem } from './components/TestimonialItem.js';
import { setupSlider } from '@scripts/client/blocks/testimonials';

export const edit = ({ attributes, setAttributes }) => {
    const {
        queryType,
        numberOfPosts,
        curatedPosts,
        layoutType,
        columnsPerRow,
        carouselColor,
    } = attributes;

    const loadOptions = useCallback((inputValue) => {
        return loadSelectOptions(inputValue, POST_TYPE.TESTIMONIAL, (post) => ({
            value: post.id,
            label: decodeHtmlEntities(post?.title?.rendered),
        }));
    }, []);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        const newCuratedPosts = arrayMove(curatedPosts, oldIndex, newIndex);
        setAttributes({ curatedPosts: newCuratedPosts });
    }, [ curatedPosts ]);

    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;
    const isQueryTypeLatest = queryType === QUERY_TYPE.LATEST;

    const isEmptySelection = isQueryTypeCurated && !curatedPosts?.length;

    const {
        postsToShow,
        isResolving,
        isEmpty,
    } = useDataQuery({
        postType: POST_TYPE.TESTIMONIAL,
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
        numberOfPosts: isQueryTypeLatest ? numberOfPosts : -1,
    }, [ queryType, curatedPosts, numberOfPosts ]);

    const gridRef = useRef(null);

    const isGrid = layoutType === LAYOUT_TYPE.GRID;
    const isCarousel = layoutType === LAYOUT_TYPE.CAROUSEL;

    const { sliderElRef } = useSlider({
        isEnabled: isCarousel && !isResolving && !isEmpty,
        setupSlider,
    }, [ queryType, layoutType, postsToShow, numberOfPosts, isResolving  ]);

    const onCuratedPostsChange = useCallback((curatedPosts) => setAttributes({ curatedPosts }), []);

    const onQueryTypeChange = useCallback((queryType) => setAttributes({ queryType }), []);

    const onNumberOfPostsChange = useCallback((numberOfPosts) => setAttributes({ numberOfPosts }), []);

    const onLayoutTypeChange = useCallback((layoutType) => setAttributes({ layoutType }), []);

    const onColumnsPerRowChange = useCallback((columnsPerRow) => setAttributes({ columnsPerRow }), []);

    const blockProps = useBlockProps({
        className: carouselColor?.slug ? `splide-color-${carouselColor?.slug}` : '',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Grid', value: LAYOUT_TYPE.GRID },
                            { label: 'Carousel', value: LAYOUT_TYPE.CAROUSEL },
                        ]}
                        onChange={onLayoutTypeChange}
                    />

                    {
                        isGrid && (
                            <RangeControl
                                label="Columns Per Row"
                                value={columnsPerRow}
                                onChange={onColumnsPerRowChange}
                                min={1}
                                max={4}
                            />
                        )
                    }

                    {
                        isCarousel && (
                            <ColorPaletteControl
                                label="Color Profile"
                                value={carouselColor?.value}
                                attributeName="carouselColor"
                                setAttributes={setAttributes}
                                allowedColors={['primary-500', 'secondary-500', 'tertiary-500']}
                            />
                        )
                    }

                    <RadioControl
                        label="Query"
                        selected={queryType}
                        options={[
                            { label: 'All', value: QUERY_TYPE.LATEST },
                            { label: 'Curated', value: QUERY_TYPE.CURATED },
                        ]}
                        onChange={onQueryTypeChange}
                    />

                    {
                        isQueryTypeLatest && (
                            <RangeControl
                                label="Number of Posts"
                                value={numberOfPosts}
                                onChange={onNumberOfPostsChange}
                                min={-1}
                                max={12}
                                help="The maximum number of posts to show (-1 for no limit)"
                            />
                        )
                    }

                    {
                        isQueryTypeCurated && (
                            <SortableSelectAsync
                                placeholder="Testimonials to show"
                                loadOptions={loadOptions}
                                value={curatedPosts}
                                onChange={onCuratedPostsChange}
                                onSortEnd={onSortEnd}
                            />
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
                    {
                        postsToShow && postsToShow?.length > 0 && (
                            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                                {
                                    isGrid ? (
                                        <div className={classNames(
                                            'testimonials__list sm:text-[0] -mt-8 sm:-mx-4 grid gap-8',
                                            columnsPerRow === 1 ? 'grid-cols-1' :
                                            columnsPerRow === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                                            columnsPerRow === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
                                            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
                                        )}
                                            ref={gridRef}
                                        >
                                            {
                                                postsToShow.map((testimonial) => (
                                                    <TestimonialItem
                                                        key={testimonial?.id}
                                                        testimonial={testimonial}
                                                        isGrid={isGrid}
                                                    />
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className="splide" ref={sliderElRef}>
                                            <div className="splide__track">
                                                <div className="splide__list">
                                                    {
                                                        postsToShow.map((testimonial) => (
                                                            <TestimonialItem
                                                                key={testimonial?.id}
                                                                testimonial={testimonial}
                                                                isGrid={isGrid}
                                                            />
                                                        ))
                                                    }
                                                </div>
                                            </div>

                                            <div className="splide__arrows mt-10 justify-center" />
                                            <div className="splide__pagination" />
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </ResourcesWrapper>
            </div>
        </>
    );
};
