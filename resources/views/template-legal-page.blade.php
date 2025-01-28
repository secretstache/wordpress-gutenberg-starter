
{{--
  Template Name: Legal Page
  Template Post Type: page
--}}

@extends('layouts.app')

@section('content')

    <div class="wp-block-ssm-section-wrapper has-background spacing-pt-2 spacing-pb-2">

        <div class="wp-block-ssm-section-wrapper__content is-layout-constrained">

            <div class="wp-block-group is-content-justification-left alignwide">

                @if ($headline)
                    <h1 class="wp-block-heading has-80-font-size">{!! $headline !!}</h1>
                @endif

            </div>

        </div>

    </div>

    @if ( $content )
        
        <div class="wp-block-ssm-section-wrapper has-background spacing-pt-3 spacing-pb-3 spacing-pt-mobile-2">

            <div class="wp-block-ssm-section-wrapper__content">

                {!! $content !!}

            </div>

        </div>

    @endif

@endsection