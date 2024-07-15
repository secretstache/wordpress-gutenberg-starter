<header class="template-header{!! $template['template_alignment'] == 'center' ? ' align-center' : '' !!}">

	<div class="grid-container">

		@if (!empty($container_classes))
			<div class="{!! $container_classes !!}">
		@endif

			@if ($template['template_headline'])
				<{!! $template['template_headline_tag'] !!} class="{!! ($template['template_headline_display'] != 'default') ? $template['template_headline_display'] : $template['template_headline_tag'] !!}">{!! $template['template_headline'] !!}</{!! $template['template_headline_tag'] !!}>
			@endif

			@if ($template['template_subheadline'])
				<p class="subheadline">{!! $template['template_subheadline'] !!}</p>
			@endif

		@if (!empty($container_classes))
			</div>
		@endif

	</div>

</header>