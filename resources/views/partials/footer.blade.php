<footer class="site-footer">

	<div class="grid-container">

		<div class="site-footer__top">

			<div class="site-footer__info">

				<div class="site-footer__socials">

					<ul>

						@if ($social_networks['twitter'])
							<li><a href="{!! $social_networks['twitter'] !!}" target="_blank"><img src="@asset('images/twitter-icon.svg')" alt="Twitter"></a></li>
						@endif

						@if ($social_networks['facebook'])
							<li><a href="{!! $social_networks['facebook'] !!}" target="_blank"><img src="@asset('images/facebook-icon.svg')" alt="Facebook"></a></li>
						@endif

						@if ($social_networks['instagram'])
							<li><a href="{!! $social_networks['instagram'] !!}" target="_blank"><img src="@asset('images/instagram-icon.svg')" alt="Instagram"></a></li>
						@endif

						@if ($social_networks['linkedin'])
							<li><a href="{!! $social_networks['linkedin'] !!}" target="_blank"><img src="@asset('images/linkedin-icon.svg')" alt="LinkedIn"></a></li>
						@endif

					</ul>

				</div>

			</div>

			@if (!empty($navigation['footer']) && is_array($navigation['footer']))
				
				<div class="site-footer__navigation">

					@foreach ($navigation['footer'] as $key => $menu_column)

						@include( 'partials.navigation', ['menu_items' => $menu_column['nav_menu'] ] )

					@endforeach

				</div>

			@endif

		</div>

		<div class="site-footer__bottom">

			<div class="site-footer__logo">

				@if (!empty($logo_assets['brand_logo']))
								
					<a href="{!! home_url() !!}">
						<img src="{!! $logo_assets['brand_logo']['url'] !!}" class="editable-svg" alt="{!! $logo_assets['brand_logo']['alt'] ?: get_bloginfo('name') !!}">
					</a>

				@endif

			</div>

			<div class="site-footer__terms">

				@if ($footer['copyright'])
					<div class="site-footer__copyright">{!! $footer['copyright'] !!}</div>
				@endif

				@if (has_nav_menu('legal_navigation'))

					<nav class="site-footer__terms__navigation">

						@include( 'partials.navigation', ['menu_items' => $navigation['legal'] ] )
								
					</nav>

				@endif

			</div>

		</div>

	</div>

</footer>