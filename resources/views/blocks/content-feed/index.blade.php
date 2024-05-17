<div {!! $wrapper_attributes !!}>

    @if ($title)

        <div class="wp-block-ssm-content-feed__headline-block">

            <h2 class="wp-block-heading is-style-line">{!! $title !!}</h2>

        </div>

    @endif

    @dump($posts)

    @dump($attributes)

</div>
