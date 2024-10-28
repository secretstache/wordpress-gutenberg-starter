import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, __experimentalDivider as Divider, RangeControl, RadioControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import {
    SortableSelectAsync,
    loadSelectOptions,
    useDataQuery,
    ResourcesWrapper,
    decodeHtmlEntities,
} from '@secretstache/wordpress-gutenberg';
import { arrayMove } from 'react-sortable-hoc';

import { POST_TYPE, QUERY_TYPE } from './index.js';

const getFullName = (firstname = '', lastName = '') => {
    return [ firstname, lastName ].join(' ');
};

export const edit = ({ attributes, setAttributes }) => {
    const {
        queryType,
        curatedPosts,
        numberOfPosts,
    } = attributes;

    const onQueryChange = useCallback((queryType) => setAttributes({
        queryType,
        curatedPosts: [],
    }), []);

    const loadMemberOptions = useCallback((inputValue) => {
        return loadSelectOptions(inputValue, POST_TYPE.TEAM, (post) => ({
            value: post.id,
            label: decodeHtmlEntities(post?.title?.rendered),
        }));
    }, []);

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        const newCuratedPosts = arrayMove(curatedPosts, oldIndex, newIndex);
        setAttributes({ curatedPosts: newCuratedPosts });
    }, [ curatedPosts ]);

    const isQueryTypeAll = queryType === QUERY_TYPE.ALL;
    const isQueryTypeCurated = queryType === QUERY_TYPE.CURATED;

    const isEmptySelection = isQueryTypeCurated && !curatedPosts?.length;

    const {
        postsToShow,
        isResolving,
        isEmpty,
    } = useDataQuery({
        postType: POST_TYPE.TEAM,
        curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
        numberOfPosts: isQueryTypeAll ? numberOfPosts : -1,
        extraQueryArgs: isQueryTypeAll ? { orderby: 'title', order: 'asc' } : {},
    }, [ queryType, curatedPosts, numberOfPosts ]);

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Query"
                        selected={queryType}
                        options={[
                            { label: 'All', value: QUERY_TYPE.ALL },
                            { label: 'Curated', value: QUERY_TYPE.CURATED },
                        ]}
                        onChange={onQueryChange}
                    />

                    {
                        ( isQueryTypeCurated ) && (
                            <>
                                <Divider margin={2}/>

                                <SortableSelectAsync
                                    onSortEnd={onSortEnd}
                                    value={curatedPosts}
                                    loadOptions={loadMemberOptions}
                                    onChange={(curatedPosts) => setAttributes({ curatedPosts })}
                                    placeholder="Team Members to show"
                                />
                            </>
                        )
                    }

                    {
                        ( isQueryTypeAll ) && (
                            <>
                                <Divider margin={2}/>

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

            <div {...blockProps}>
                <ResourcesWrapper
                    isLoading={isResolving}
                    isEmptyResources={isEmpty}
                    isEmptySelection={isEmptySelection}
                >
                    {
                        postsToShow && postsToShow.length > 0 && (
                            <div className="team-members__list mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 text-center">
                                {
                                    postsToShow.map(member => {
                                        const fullName = getFullName(member?.acf?.team_first_name, member?.acf?.team_last_name);

                                        return (
                                            <div className="team-members__member" key={member?.id}>
                                                {
                                                    member?.acf?.team_headshot && (
                                                        <div className="team-members__member-image mx-auto h-56 w-56 rounded-full overflow-hidden">
                                                            <img
                                                                className="object-cover inline-block align-middle border-0 max-w-full w-full !h-full"
                                                                src={member?.acf?.team_headshot?.url}
                                                                alt={member?.acf?.team_headshot?.alt || decodeHtmlEntities(member?.title?.rendered)}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                <div className="team-members__member-content mt-6">

                                                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                                                        {decodeHtmlEntities(fullName || member?.title?.rendered)}
                                                    </h3>

                                                    {
                                                        member?.acf?.team_job_title && (
                                                            <div className="text-base leading-7 text-gray-600">
                                                                {decodeHtmlEntities(member?.acf?.team_job_title)}
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        member?.acf?.team_division_location && (
                                                            <div className="text-sm leading-7 text-gray-600 mt-3">
                                                                {decodeHtmlEntities(member?.acf?.team_division_location)}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )
                    }
                </ResourcesWrapper>
            </div>
        </>
    );
};
