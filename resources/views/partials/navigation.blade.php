@foreach ($menu_items as $item)

    <li class="menu__item{!! !empty( $item->children ) ? ' menu-item-has-children' : '' !!}{!! $item->classes ? ' ' . $item->classes : '' !!}">

        <a href="{!! $item->url !!}">{!! $item->label !!}</a>

        @if ( !empty( $item->children ) )

            <button type="button" aria-expanded="false" aria-label="More {!! $item->label !!} pages" class="dropdown-arrow"></button>

            <div class="submenu-wrapper">

                <ul class="menu">

                    @foreach ($item->children as $child)

                        <li class="menu__item{!! $child->classes ? ' ' . $child->classes : '' !!}">

                            <a href="{!! $child->url !!}">

                                <p class="menu__item-title">{!! $child->label !!}</p>

                            </a>

                        </li>

                    @endforeach

                </ul>

            </div>

        @endif

    </li>

@endforeach