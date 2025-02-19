@php
    /**
    * @var $is_editor bool
    */
@endphp

<header @class([
    'site-header',
    'site-header--editor' => $is_editor,
])>

	<div class="grid-container">

		<div class="grid-x align-middle">

			<div class="site-header__brand cell shrink">

				@if (!empty($logo_assets['brand_logo']))
								
					<a href="{!! home_url() !!}">
						<img src="{!! $logo_assets['brand_logo']['url'] !!}" alt="{!! $logo_assets['brand_logo']['alt'] ?: get_bloginfo('name') !!}" class="editable-svg">
					</a>

				@endif

			</div>

			@if ( has_nav_menu('primary_navigation') )

				<div class="cell shrink">

					<nav class="site-header__navigation show-for-large">

						@include( 'partials.navigation', ['menu_items' => $navigation['primary'] ] )
							
					</nav>
					
					@include( 'partials.hamburger' )

				</div>

			@endif

		</div>

	</div>
  
</header>