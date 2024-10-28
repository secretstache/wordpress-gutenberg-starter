@php
    /**
    * @var $wrapper_attributes
    * @var $query
    * @var $number_posts
    * @var $posts
    * @var $layout string
    */
@endphp

<div {!! $wrapper_attributes !!}>

    @if( ! empty( $posts ) && ( $query == 'curated' || $number_posts != 0 ) )

        <div class="mx-auto {!! $layout == 'grid' ? 'mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none' : '' !!}">

            @if( $layout == 'grid' )

                <div class="testimonials__list -mt-8 sm:-mx-4 sm:text-[0] grid gap-8 {!! $columns_classname !!}">

            @elseif( $layout == 'carousel' )

                <div class="splide">

                    <div class="splide__track">

                        <div class="splide__list">

            @endif

                @foreach( $posts as $post_id )

                    @php

                        $headshot       = get_field( 'testimonial_headshot', $post_id );
                        $quote          = get_field( 'testimonial_quote', $post_id );
                        $citation_name  = get_field( 'testimonial_citation_name', $post_id );
                        $job_title      = get_field( 'testimonial_job_title', $post_id );

                    @endphp

                    @if( $layout == 'grid' )

                        @if( $quote )

                            <div class="testimonials__item w-full h-full flex">

                                <figure class="rounded-2xl bg-gray-50 p-8 text-sm leading-6 flex flex-col h-full w-full">

                                    <blockquote class="text-gray-900">{!! $quote !!}</blockquote>

                                    <figcaption class="mt-6 flex items-center gap-x-4">

                                        @if( function_exists('ipq_get_theme_image') && $headshot )

                                            <div class="h-10 w-10 min-w-10 rounded-full bg-gray-50 overflow-hidden">

                                                {!!
                                                    ipq_get_theme_image( $headshot['ID'],
                                                        [ [ 40, 40, true ], [ 80, 80, true ], [ 160, 160, true ] ],
                                                        [
                                                            'class' => 'rounded-full object-cover inline-block align-middle max-w-full w-full !h-full',
                                                            'alt'   => get_the_title( $post_id ),
                                                        ]
                                                    );
                                                !!}

                                            </div>

                                        @endif

                                        @if( $citation_name || $job_title )

                                            <div class="testimonials__info">

                                                @if( $citation_name )

                                                    <div class="font-semibold text-gray-900">{!! $citation_name !!}</div>

                                                @endif

                                                @if( $job_title )

                                                    <div class="text-gray-600">{!! $job_title !!}</div>

                                                @endif

                                            </div>

                                        @endif

                                    </figcaption>

                                </figure>

                            </div>

                        @endif

                    @elseif( $layout == 'carousel' )

                        @if( $quote )

                            <div class="splide__slide">

                                <div class="testimonials__item mx-auto max-w-2xl lg:max-w-4xl">

                                    <figure class="mt-10">

                                        <blockquote class="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">{!! $quote !!}</blockquote>

                                        <figcaption class="mt-10">

                                            @if( function_exists('ipq_get_theme_image') && $headshot )

                                                <div class="mx-auto h-10 w-10 rounded-full">

                                                    {!!
                                                        ipq_get_theme_image( $headshot['ID'],
                                                            [ [ 40, 40, true ], [ 80, 80, true ], [ 160, 160, true ] ],
                                                            [
                                                                'class' => 'rounded-full object-cover inline-block align-middle max-w-full w-full !h-full',
                                                                'alt'   => get_the_title( $post_id ),
                                                            ]
                                                        );
                                                    !!}

                                                </div>

                                            @endif

                                            @if( $citation_name || $job_title )

                                                <div class="mt-4 flex items-center justify-center space-x-3 text-base">

                                                    @if( $citation_name )

                                                        <div class="font-semibold text-gray-900">{!! $citation_name !!}</div>

                                                    @endif

                                                    @if( $citation_name && $job_title )

                                                        <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" class="fill-gray-900"><circle cx="1" cy="1" r="1" /></svg>

                                                    @endif

                                                    @if( $job_title )

                                                        <div class="text-gray-600">{!! $job_title !!}</div>

                                                    @endif

                                                </div>

                                            @endif

                                        </figcaption>

                                    </figure>

                                </div>

                            </div>

                        @endif

                    @endif

                @endforeach

            @if( $layout == 'grid' )

                </div>

            @elseif( $layout == 'carousel' )

                        </div>

                    </div>

                    <div class="splide__arrows mt-10 justify-center"></div>
                    <div class="splide__pagination"></div>
                </div>

            @endif

        </div>

    @else

        <p>No testimonials were found.</p>

    @endif

</div>
