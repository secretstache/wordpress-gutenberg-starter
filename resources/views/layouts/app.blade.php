@include('partials.offcanvas')

@include('partials.header')

<main class="content flex-grow overflow-clip" id="main">
    @yield('content')
</main>

@include('partials.footer')
