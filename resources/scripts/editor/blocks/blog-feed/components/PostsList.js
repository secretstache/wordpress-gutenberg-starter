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
            'blog-feed__list mt-16', {
                [`mx-auto grid max-w-2xl gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-${columnsPerRow || 3}`]: isBlockGrid,
                'space-y-20 lg:mt-20 lg:space-y-20': !isBlockGrid,
        })}>
            {
                posts?.map((post) => {
                    const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0];
                    const category = post?._embedded?.['wp:term']?.[0]?.[0];
                    const date = format('M j, Y', post?.date);
                    const authorInfo = authorInfoMap?.[post?.id];

                    return (
                        <a href="#" key={post?.id} className={
                            classNames(
                                'blog-feed__item flex flex-col',
                                {
                                    'items-start justify-between': isBlockGrid,
                                    'relative isolate gap-8 lg:flex-row': !isBlockGrid,
                                },
                            )
                        }>
                            {
                                ( featuredImage && isShowFeaturedImage ) && (
                                    <div className={
                                        classNames(
                                            'blog-feed__img-wrapper relative overflow-hidden sm:aspect-[2/1]',
                                            {
                                                'w-full aspect-[16/9] rounded-2xl bg-gray-100 lg:aspect-[3/2]': isBlockGrid,
                                                'aspect-[16/9] rounded-2xl lg:aspect-square lg:w-64 lg:shrink-0': !isBlockGrid,
                                            },
                                        )
                                    }>
                                        <img
                                            className="blog-feed-image object-cover inline-block align-middle max-w-full w-full !h-full"
                                            src={featuredImage.source_url}
                                            alt={featuredImage.alt_text || decodeHtmlEntities(post?.title?.rendered)}
                                        />

                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
                                    </div>
                                )
                            }

                            <div className="blog-feed__content max-w-xl">
                                { isShowPostMeta && (
                                    <div className={`${isBlockGrid ? 'mt-8' : ''} flex items-center gap-x-4 text-xs`}>
                                        {
                                            date && (
                                                <time className="text-gray-500">{date}</time>
                                            )
                                        }

                                        {
                                            category && (
                                                <span
                                                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                                                        {decodeHtmlEntities(category?.name)}
                                                </span>
                                            )
                                        }
                                    </div>
                                )}

                                <div className={`${( isShowPostMeta || !isBlockGrid ) ? '' : 'mt-8'} group relative`}>
                                    {
                                        isShowTitle && (
                                            <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 mt-3">
                                                {decodeHtmlEntities(post?.title?.rendered)}
                                            </h3>
                                        )
                                    }

                                    <div className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                        <p dangerouslySetInnerHTML={{ __html: post?.excerpt?.raw }}/>
                                    </div>
                                </div>

                                {
                                    ( isShowPostMeta && authorInfo ) && (
                                        <div className={
                                            classNames(
                                                'relative mt-8 flex items-center gap-x-4',
                                                {
                                                    'border-t border-gray-900/5 pt-6': !isBlockGrid,
                                                },
                                            )
                                        }>
                                            {
                                                authorInfo?.avatar_urls && (
                                                    <img
                                                        src={ authorInfo?.avatar_urls?.[48] }
                                                        alt={ authorInfo?.name || 'Author Avatar' }
                                                        className="h-10 w-10 rounded-full bg-gray-100"
                                                    />
                                                )
                                            }

                                            {
                                                authorInfo?.name && (
                                                    <div className="text-sm leading-6">
                                                        <p className="font-semibold text-gray-900">
                                                            <span className="absolute inset-0"></span>
                                                            { authorInfo?.name }
                                                        </p>
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
