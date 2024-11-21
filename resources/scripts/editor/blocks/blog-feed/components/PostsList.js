import { format } from '@wordpress/date';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { decodeHtmlEntities } from '@secretstache/wordpress-gutenberg';

export const PostsList = ({
    posts,
    isShowFeaturedImage,
    isShowTitle,
    isShowPostMeta,
    isBlockGrid,
    columnsPerRow,
}) => {
    if (!posts) return;

    const authorInfoMap = useSelect((select) => {
        return posts.reduce((acc, post) => {
            acc[post.id] = select('core').getUser(post.author);

            return acc;
        }, {});
    }, [ posts ]);

    return (
        <div className={classNames(
            'blog-feed__list', {
                'block-grid': isBlockGrid,
                'stacked': !isBlockGrid,
        })}>
            {
                posts?.map((post) => {
                    const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0];
                    const category = post?._embedded?.['wp:term']?.[0]?.[0];
                    const date = format('M j, Y', post?.date);
                    const authorInfo = authorInfoMap?.[post?.id];

                    return (
                        <a href="#" key={post?.id} className="blog-feed__item">
                            {
                                ( featuredImage && isShowFeaturedImage ) && (
                                    <div className="blog-feed__img-wrapper">
                                        <img
                                            className="blog-feed-image"
                                            src={featuredImage.source_url}
                                            alt={featuredImage.alt_text || decodeHtmlEntities(post?.title?.rendered)}
                                        />
                                    </div>
                                )
                            }

                            <div className="blog-feed__content">
                                { isShowPostMeta && (
                                    <div>
                                        {
                                            date && (
                                                <time>{date}</time>
                                            )
                                        }

                                        {
                                            category && (
                                                <span>
                                                    {decodeHtmlEntities(category?.name)}
                                                </span>
                                            )
                                        }
                                    </div>
                                )}

                                <div>
                                    {
                                        isShowTitle && (
                                            <h3>
                                                {decodeHtmlEntities(post?.title?.rendered)}
                                            </h3>
                                        )
                                    }

                                    <p dangerouslySetInnerHTML={{__html: post?.excerpt?.raw}}/>
                                </div>

                                {
                                    ( isShowPostMeta && authorInfo ) && (
                                        <div>
                                            {
                                                authorInfo?.avatar_urls && (
                                                    <div>
                                                        <img
                                                            src={authorInfo?.avatar_urls?.[48]}
                                                            alt={authorInfo?.name || 'Author Avatar'}
                                                        />
                                                    </div>
                                                )
                                            }

                                            {
                                                authorInfo?.name && (
                                                    <div>
                                                        { authorInfo?.name }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </a>
                    );
                })
            }
        </div>
    );
};
