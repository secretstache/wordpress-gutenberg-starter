import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import {
    useDataQuery,
    ResourcesWrapper,
    decodeHtmlEntities,
    DataQueryControls,
} from '@secretstache/wordpress-gutenberg';

import { POST_TYPE, QUERY_TYPE } from './index.jsx';

const getFullName = (firstname = '', lastName = '') => {
    return [ firstname, lastName ].filter(Boolean).join(' ') || '';
};

export const edit = ({ attributes, setAttributes }) => {
    const {
        queryType,
        curatedPosts,
        numberOfPosts,
    } = attributes;

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
        extraQueryArgs: isQueryTypeAll ? { order: 'asc', orderby: 'meta_value', meta_key: 'team_last_name' } : {},
    }, [ queryType, curatedPosts, numberOfPosts ]);

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <DataQueryControls
                        attributes={attributes}
                        setAttributes={setAttributes}
                    >
                        <DataQueryControls.QueryType options={[
                            { label: 'All', value: QUERY_TYPE.ALL },
                            { label: 'Curated', value: QUERY_TYPE.CURATED },
                        ]} />

                        <DataQueryControls.CuratedPosts
                            condition={isQueryTypeCurated}
                            attributeName="curatedPosts"
                            postType={POST_TYPE.TEAM}
                            placeholder="Team Members to show"
                        />

                        <DataQueryControls.NumberOfPosts
                            condition={!isQueryTypeCurated}
                            attributeName="numberOfPosts"
                            value={numberOfPosts}
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
