
{{--
  Template Name: Legal Page
  Template Post Type: page
--}}

@extends('layouts.app')

@section('content')

    <section class="content-block template-free-form">
                
        <div class="grid-container">

            <header class="template-header">

                <h2 class="headline">{!! get_the_title( get_the_ID() ) !!}</h2>

            </header>

            @if ( $data['legal_editor'] )
                    
                <div class="grid-x grid-margin-x has-1-cols">

                    <div class="cell medium-12">

                        <div class="inner">

                            <div class="module text-editor">{!! $data['legal_editor'] !!}</div>            

                        </div>

                    </div>

                </div>

            @endif

        </div>

    </section>

@endsection