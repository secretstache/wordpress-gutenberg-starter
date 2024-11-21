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
                            <div className="team-members__list">
                                {
                                    postsToShow.map(member => {
                                        const fullName = getFullName(member?.acf?.team_first_name, member?.acf?.team_last_name);

                                        return (
                                            <div className="team-members__member" key={member?.id}>
                                                {
                                                    member?.acf?.team_headshot && (
                                                        <div className="team-members__member-image">
                                                            <img
                                                                src={member?.acf?.team_headshot?.url}
                                                                alt={member?.acf?.team_headshot?.alt || decodeHtmlEntities(member?.title?.rendered)}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                <div className="team-members__member-content">

                                                    <h3>
                                                        {decodeHtmlEntities(fullName || member?.title?.rendered)}
                                                    </h3>

                                                    {
                                                        member?.acf?.team_job_title && (
                                                            <div className="team-members__member-job-title">
                                                                {decodeHtmlEntities(member?.acf?.team_job_title)}
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        member?.acf?.team_division_location && (
                                                            <div className="team-members__member-division-location">
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
