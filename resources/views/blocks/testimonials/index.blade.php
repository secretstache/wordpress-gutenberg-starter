@php
    /**
    * @var $wrapper_attributes
    * @var $query
    * @var $number_posts
    * @var $posts
    * @var $layout string
    */

    // TODO: refactor closing divs, create separate partials
@endphp

<div {!! $wrapper_attributes !!}>

    @if( ! empty( $posts ) && ( $query == 'curated' || $number_posts != 0 ) )

        <div class="">

            @if( $layout == 'grid' )

                <div class="testimonials__list">

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

                            <div class="testimonials__item">

                            </div>

                        @endif

                    @elseif( $layout == 'carousel' )

                        @if( $quote )

                            <div class="splide__slide">

                                <div class="testimonials__item">

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

                    <div class="splide__arrows"></div>
                    <div class="splide__pagination"></div>
                </div>

            @endif

        </div>

    @else

        <p>No testimonials were found.</p>

    @endif

</div>
