@include('partials.offcanvas')
	
@include('partials.header')

<div class="container">

	<main class="content" id="main">
		@yield('content')
	</main>

</div>

@include('partials.footer')