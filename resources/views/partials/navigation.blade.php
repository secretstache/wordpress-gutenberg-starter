@foreach ($menu_items as $item)

    <li class="menu__item{!! !empty( $item->children ) ? ' menu-item-has-children' : '' !!}{!! $item->classes ? ' ' . $item->classes : '' !!}">

        <a target="{{ $item->target ?: '_self' }}" href="{!! $item->url !!}">{!! $item->label !!}</a>

        @if (!empty($item->children))

            <ul class="submenu">

                @foreach ($item->children as $child)

                    <li class="submenu_menu__item{!! $child->classes ? ' ' . $child->classes : '' !!}">

                        <a target="{{ $child->target ?: '_self' }}" href="{!! $child->url !!}">{!! $child->label !!}</a>

                    </li>

                @endforeach

            </ul>

        @endif

    </li>

@endforeach