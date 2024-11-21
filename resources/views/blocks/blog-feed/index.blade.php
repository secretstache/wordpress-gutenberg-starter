@php
    /**
    * @var $wrapper_attributes
    * @var $posts
    * @var $number_posts
    */
@endphp

<div {!! $wrapper_attributes !!}>

    @if ( ! empty( $posts ) && $number_posts != 0 )

        <div class="blog-feed__list">

            @foreach ( $posts as $post_id )

                @php
                    $categories         = get_the_category($post_id);
                    $author_id          = get_post_field( 'post_author', $post_id );
                    $author_name        = get_the_author_meta( 'display_name', $author_id );
                    $author_avatar_url  = get_avatar_url( $author_id );
                @endphp

                <a href="{!! get_permalink($post_id) !!}" class="blog-feed__item">

                    @if ( has_post_thumbnail( $post_id ) && $show_featured_image )

                        <div class="blog-feed__image-wrapper">

                            @if ( function_exists('ipq_get_theme_image') )
                                {!!
                                    ipq_get_theme_image( get_post_thumbnail_id( $post_id ),
                                        [ [ 480, 320, true ], [ 960, 640, true ], [ 1920, 1280, true ] ],
                                        [
                                            'class' => 'blog-feed__image',
                                            'alt'   => get_the_title( $post_id ),
                                        ]
                                    );
                                !!}
                            @endif

                        </div>

                    @endif

                    <div class="blog-feed__content">
                        <h3>{!! get_the_title( $post_id ) !!}</h3>

                        @if ( ! empty( get_the_excerpt( $post_id ) ) )

                            <p>{!! wp_trim_words( get_the_excerpt( $post_id ), 30 )  !!}</p>

                        @endif

                    </div>

                </a>

            @endforeach

        </div>

    @else

        <p>No resources were found.</p>

    @endif

</div>
