@php
    /**
    * @var $wrapper_attributes
    * @var $posts
    */
@endphp

<div {!! $wrapper_attributes !!}>

    @if (!empty($posts))

        <div class="splide" role="group" aria-label="Testimonials">

            <div class="splide__track">

                <div class="splide__list">

                    @foreach ($posts as $post_id)

                        @php
                            $quote         = get_field('testimonial_quote', $post_id);
                            $citation_name = get_field('testimonial_name', $post_id);
                            $job_title     = get_field('testimonial_job_title', $post_id);
                        @endphp

                        <div class="splide__slide md:flex md:gap-x-16 items-center">

                            @if (has_post_thumbnail($post_id))
                                    
                                <div class="wp-block-ssm-testimonial__media md:w-1/2 md:min-w-1/2">
                                        
                                    @if (function_exists('ipq_get_theme_image'))

                                        {!!
                                            ipq_get_theme_image( get_post_thumbnail_id($post_id),
                                                [ [ 700, 525, true ], [ 1400, 1050, true ], [ 2800, 2100, true ] ],
                                                [
                                                    'alt'   => get_the_title( $post_id ),
                                                    'class' => 'testimonial-img block w-full'
                                                ]
                                            );
                                        !!}
                                        
                                    @else
                                        
                                        <img src="{!! get_the_post_thumbnail_url($post_id) !!}" alt="{!! get_the_title($post_id) !!}" class="block w-full">

                                    @endif

                                </div>

                            @endif

                            <div class="wp-block-ssm-testimonial__content w-full relative flex flex-col justify-center md:py-20 md:h-full max-md:mt-8">

                                @if ($quote)
                                    <blockquote class="text-4xl font-bold">{!! '“' . trim(strip_tags($quote)) . '“' !!}</blockquote>
                                @endif

                                @if ($job_title || $citation_name)

                                    <cite class="block mt-8 not-italic border-l-2 border-bright-orange pl-4 flex flex-col gap-y-2">

                                        @if ($citation_name)
                                            <strong class="block">{!! $citation_name !!}</strong>
                                        @endif

                                        @if ($job_title)
                                            {!! $job_title !!}
                                        @endif

                                    </cite>
                                    
                                @endif

                                <div class="splide__arrows md:absolute md:bottom-0 md:left-0 flex gap-1.5 z-10 max-md:mt-8">

                                    <button class="splide__arrow splide__arrow--prev flex items-center justify-center w-13 h-13 border-2 border-charcoal text-charcoal cursor-pointer hover:bg-burnt-orange hover:text-white hover:border-burnt-orange dark:border-white dark:text-white dark:hover:text-charcoal dark:hover:bg-white transition-colors">
                                        <div class="sr-only">Prev</div>
                                        <svg aria-hidden="true" width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6123 9.28571L2.62595 5.29936L6.6123 1.313L5.29931 -5.7393e-08L-5.17301e-05 5.29936L5.2993 10.5987L6.6123 9.28571Z" fill="currentColor"/></svg>
                                    </button>

                                    <button class="splide__arrow splide__arrow--next flex items-center justify-center w-13 h-13 border-2 border-charcoal text-charcoal cursor-pointer hover:bg-burnt-orange hover:text-white hover:border-burnt-orange dark:border-white dark:text-white dark:hover:text-charcoal dark:hover:bg-white transition-colors"><div class="sr-only">Next</div>
                                        <svg aria-hidden="true"  width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.83594 7.01897L11.8223 11.0053L7.83594 14.9917L9.14894 16.3047L14.4483 11.0053L9.14894 5.70597L7.83594 7.01897Z" fill="currentColor"/></svg>
                                    </button>

                                </div>

                            </div>

                        </div>

                    @endforeach

                </div>

            </div>

        </div>

    @else

        <p>No testimonials were found.</p>

    @endif

</div>
