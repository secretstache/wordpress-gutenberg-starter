@extends('layouts.app')

@section('content')
	
	<h1 style="margin-bottom: 60px; margin-top: 150px; text-align:center; position:relative;">{!! get_the_title() !!}</h1>

	{!! the_content() !!}

@endsection