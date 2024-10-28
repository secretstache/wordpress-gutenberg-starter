@php
    /**
     * @var $wrapper_attributes
     * @var $background_color_class string
     * @var $background_media
     * @var $overlay_color_class string
     */
@endphp

<div {!! $wrapper_attributes !!}>

    @if ( $background_color_class )
        <span
            aria-hidden="true"
            class="wp-block-ssm-section-wrapper__background {!! $background_color_class !!}"
        ></span>
    @endif

    @if ( $background_media )
        <div class="wp-block-ssm-section-wrapper__background {!! $overlay_color_class !!}}">

            @if ( $background_media['type'] === 'image' && $background_media['url'] )
                <img
                    src="{!!$background_media['url'] !!}"
                    alt="{!! $background_media['alt'] !!}"
                />
            @endif

            @if ( $background_media['type'] === 'video' && $background_media['url'] )
                <video
                    src="{!!$background_media['url'] !!}"
                    autoPlay
                    playsInline
                    muted
                    loop
                ></video>
            @endif

            @if ( $background_media['type'] === 'animation' && $background_media['url'] )

                @if ( str_ends_with($background_media['url'], '.json') )
                    <lottie-player mode="normal" src="{!! $background_media['url'] !!}"{!! $background_media['is_looped'] ? ' loop' : '' !!}></lottie-player>
                @elseif ( str_ends_with($background_media['url'], '.lottie') )
                    <dotlottie-player mode="normal" src="{!! $background_media['url'] !!}"{!! $background_media['is_looped'] ? ' loop' : '' !!}></dotlottie-player>
                @endif

            @endif

        </div>
    @endif

    <div class="wp-block-ssm-section-wrapper__content">

        {!! $content !!}

    </div>

</div>
