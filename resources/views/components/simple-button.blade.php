@if ( $button && $button['button_label'] )
    
    @if ( $button['button_source'] == 'internal' && $button['button_page_id'] )

        <a class="{!! $button_classes !!}" href="{!! get_permalink( $button['button_page_id'] ) !!}" target="{!! $button['option_button_target'] !!}">{!! $button['button_label'] !!}</a>

    @elseif ( $button['button_source'] == 'external' && $button['button_url'] )

        <a class="{!! $button_classes !!}" href="{!! $button['button_url'] !!}" target="{!! $button['option_button_target'] !!}">{!! $button['button_label'] !!}</a>
        
    @endif

@endif