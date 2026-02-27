@php
    /**
    * @var $wrapper_attributes
    * @var $posts
    */
@endphp

<div {!! $wrapper_attributes !!}>

    @if( !empty( $posts ) )

        <div class="team-members__list">

            @foreach( $posts as $post_id )

                @php
                    $headshot   = get_field( 'team_headshot', $post_id );
                    $first_name = get_field( 'team_first_name', $post_id );
                    $last_name  = get_field( 'team_last_name', $post_id );
                    $job_title  = get_field( 'team_job_title', $post_id );
                    $full_name  = trim("$first_name $last_name") ?: get_the_title($post_id);
                @endphp

                <div class="team-members__member">

                    @if( $headshot )

                        <div class="team-members__member-image">

                            @if (function_exists('ipq_get_theme_image'))

                                {!!
                                    ipq_get_theme_image( $headshot['ID'],
                                        [ [ 230, 230, true ], [ 460, 460, true ], [ 920, 920, true ] ],
                                        [
                                            'alt'   => $full_name,
                                            'class' => 'team-member-img'
                                        ]
                                    );
                                !!}
                                
                            @else

                                <img src="{!! $headshot['url'] !!}" alt="{!! $full_name !!}">
                                
                            @endif

                        </div>

                    @endif

                    <div class="team-members__member-content">

                        <h3>{!! $full_name !!}</h3>

                        @if( $job_title )
                            <div class="team-members__member-job-title">{!! $job_title !!}</div>
                        @endif

                    </div>

                </div>

            @endforeach

        </div>

    @else

        <p>No team members were found.</p>

    @endif

</div>


