@extends('layouts.app')

@section('content')

    @if (!have_posts())
        {!! get_search_form(false) !!}
    @endif

    @while(have_posts()) @php(the_post())
        <h3>{!! the_title() !!}</h3>
    @endwhile

    {!! get_the_posts_navigation() !!}

@endsection
