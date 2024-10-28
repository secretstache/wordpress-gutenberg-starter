@php
    /**
    * @var $wrapper_attributes
    * @var $query
    * @var $number_posts
    * @var $posts
    */
@endphp

<div {!! $wrapper_attributes !!}>

    @if( ! empty( $posts ) && ( $query == 'curated' || $number_posts != 0 ) )

        <div class="team-members__list mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 text-center">

            @foreach( $posts as $post_id )

                @php
                    $headshot   = get_field( 'team_headshot', $post_id );
                    $first_name = get_field( 'team_first_name', $post_id );
                    $last_name  = get_field( 'team_last_name', $post_id );
                    $full_name  = ( $first_name ?? '' ) . ( $last_name ? ' ' . $last_name : '' );
                    $job_title  = get_field( 'team_job_title', $post_id );
                    $division   = get_field( 'team_division_location', $post_id );
                @endphp

                <div class="team-members__member">

                    @if( function_exists('ipq_get_theme_image') && $headshot )

                        <div class="team-members__member-image mx-auto h-56 w-56 rounded-full overflow-hidden">

                            {!!
                                ipq_get_theme_image( $headshot['ID'],
                                    [ [ 230, 230, true ], [ 460, 460, true ], [ 920, 920, true ] ],
                                    [
                                        'class' => 'object-cover inline-block align-middle border-0 max-w-full w-full !h-full',
                                        'alt'   => get_the_title( $post_id ),
                                    ]
                                );
                            !!}

                        </div>

                    @endif

                    <div class="team-members__member-content mt-6">

                        <h3 class="text-lg font-semibold leading-7 tracking-tight text-gray-900">{!! $full_name ?: get_the_title( $post_id ) !!}</h3>

                        @if( $job_title )

                            <div class="text-base leading-7 text-gray-600">{!! $job_title !!}</div>

                        @endif

                        @if( $division )

                            <div class="text-sm leading-7 text-gray-600 mt-3">{!! $division !!}</div>

                        @endif

                        <div class="wp-block-button is-style-primary-outline mt-5">
                            <a href="{!! get_permalink( $post_id ) !!}" class="wp-block-button__link wp-element-button">Read Bio</a>
                        </div>

                    </div>

                </div>

            @endforeach

        </div>

    @else

        <p>No team members were found.</p>

    @endif

</div>


