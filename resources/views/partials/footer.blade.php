<footer class="site-footer">

	<div class="grid-container">

		<div class="site-footer__top">

			<div class="site-footer__info">

				<div class="site-footer__socials">

					<ul>

						@if ( $twitter = $social_networks['twitter'] )
							<li><a href="{!! $twitter !!}" target="_blank"><img src="@asset('images/twitter-icon.svg')" alt="Twitter"></a></li>
						@endif

						@if ( $facebook = $social_networks['facebook'] )
							<li><a href="{!! $facebook !!}" target="_blank"><img src="@asset('images/facebook-icon.svg')" alt="Facebook"></a></li>
						@endif

						@if ( $instagram = $social_networks['instagram'] )
							<li><a href="{!! $instagram !!}" target="_blank"><img src="@asset('images/instagram-icon.svg')" alt="Instagram"></a></li>
						@endif

						@if ( $linkedin = $social_networks['linkedin'] )
							<li><a href="{!! $linkedin !!}" target="_blank"><img src="@asset('images/linkedin-icon.svg')" alt="LinkedIn"></a></li>
						@endif

					</ul>

				</div>

			</div>

			@if ( is_array( $navigation['footer'] ) && !empty( $navigation['footer'] ) )
				
				<div class="site-footer__navigation">

					@foreach ($navigation['footer'] as $key => $menu_column)

						@include( 'partials.navigation', ['menu_items' => $menu_column['nav_menu'] ] )

					@endforeach

				</div>

			@endif

		</div>

		<div class="site-footer__bottom">

			<div class="site-footer__logo">

				@if ( ( $brand_logo = $logo_assets['brand_logo'] ) && $brand_logo['url'] )
								
					<a href="{!! home_url() !!}">
						<img src="{!! $brand_logo['url'] !!}" class="editable-svg" alt="{!! $brand_logo['alt'] ?: get_bloginfo('name') !!}">
					</a>

				@endif

			</div>

			<div class="site-footer__terms">

				@if ( $footer['copyright'] )
					{!! $footer['copyright'] !!}
				@endif

				@if ( has_nav_menu('legal_navigation') )

					<nav class="site-footer__terms__navigation">

						@include( 'partials.navigation', ['menu_items' => $navigation['primary'] ] )
								
					</nav>

				@endif

			</div>

		</div>

	</div>

</footer>