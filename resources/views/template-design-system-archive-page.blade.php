{{--
  Template Name: Design System Archive Page
  Template Post Type: ssm_design_system
--}}

@extends('layouts.app')

@section('content')

    <section class="content-block hero-unit">
                    
        <div class="grid-container">

            <h1 class="headline">Design System</h1>
            
        </div>
        
    </section>

    <section class="content-block template-block-grid">

        <div class="grid-container">

            @if ( $content_above = get_field( 'design_system_archive_above', get_the_ID() ) )
                <div class="module text-editor text-center">{!! $content_above !!}</div>
            @endif

            @if ( $types = get_field( 'design_system_archive_types', get_the_ID() ) )
                
                @foreach ($types as $type)

                    @php
                                    
                        $args = [
                            'post_type'      => 'ssm_design_system',
                            'posts_per_page' => -1,
                            'status'         => 'publish',
                            'fields' 	     => 'ids',
                            'orderby'        => 'title',
                            'order'          => 'ASC',
                            'tax_query'      => [
                                [
                                    'taxonomy' => 'ssm_ds_type',
                                    'terms'    => $type->slug,
                                    'field'    => 'slug',
                                    'operator' => 'IN'
                                ]
                            ],
                        ];

                        $posts = get_posts( $args );

                    @endphp

                    @if ( $posts && !empty( $posts ) )
                        
                        <header class="template-header align-center">
                            <h3 class="headline">{!! $type->name !!}</h3>
                        </header>

                        <div class="grid-item">
            
                            @foreach ($posts as $post_id)
                                        
                                <a href="{!! get_permalink( $post_id ) !!}" class="card-item">

                                    <div class="description-block">
                                        <h3 class="title">{!! get_the_title( $post_id ) !!}</h3>
                                    </div>

                                </a>
                                        
                            @endforeach
            
                        </div>

                    @endif
                    
                @endforeach

            @endif

            @if ( $content_below = get_field( 'design_system_archive_below', get_the_ID() ) )
                <div class="module text-editor text-center">{!! $content_below !!}</div>
            @endif
        
        </div>

    </section>

@endsection