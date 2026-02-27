@php
    /**
    * @var $wrapper_attributes
    * @var $posts
    * @var $include_filters
    */
@endphp

<div {!! $wrapper_attributes !!}>

    <div class="blog-feed__list{!! $include_filters ? ' facetwp-template' : '' !!}">

        @if (!empty($posts))

            @foreach ( $posts as $post_id )

                @php
                    $categories = get_the_category($post_id);
                    $title      = get_the_title( $post_id );
                    $excerpt    = $builder->getPostExcerpt($post_id);
                @endphp

                <a href="{!! get_permalink($post_id) !!}" class="blog-feed__item">

                    @if (has_post_thumbnail($post_id))

                        <div class="blog-feed__image-wrapper">

                            @if ( function_exists('ipq_get_theme_image') )

                                {!!
                                    ipq_get_theme_image( get_post_thumbnail_id( $post_id ),
                                        [ [ 480, 320, true ], [ 960, 640, true ], [ 1920, 1280, true ] ],
                                        [
                                            'class' => 'blog-feed__image blog-img',
                                            'alt'   => $title,
                                        ]
                                    );
                                !!}

                            @else 
                                    
                                <img class="blog-feed__image" src="{!! get_the_post_thumbnail_url($post_id) !!}" alt="{!! $title !!}">

                            @endif

                        </div>

                    @endif

                    <div class="blog-feed__content">

                        <h3>{!! $title !!}</h3>

                        @if ($excerpt)
                            <p>{!! $excerpt !!}</p>
                        @endif

                    </div>

                </a>

            @endforeach

        @else

            <p>No resources were found.</p>

        @endif

    </div>

</div>
