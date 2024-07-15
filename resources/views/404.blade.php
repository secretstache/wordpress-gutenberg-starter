@extends('layouts.app')

@section('content')

	<header class="page-header" style="margin-top:120px">

		<div class="grid-container">

			<div class="grid-x grid-margin-x align-center medium-align-left">

				<div class="cell small-12 medium-12">
					<h1 class="headline">Not Found</h1>
				</div>

			</div>

		</div>

	</header>

	<div class="grid-container" style="margin-bottom:120px">

		<div class="alert alert-warning">
			{{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }}
		</div>

	</div>

@endsection