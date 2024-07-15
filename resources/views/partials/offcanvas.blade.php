<div class="offcanvas" id="offcanvas">

    <div class="offcanvas__inner">

        <div class="grid-container">

            <button data-dismiss="offcanvas" class="offcanvas__close-btn">✕<span class="show-for-sr">Close</span></button>

            @if ( has_nav_menu('primary_navigation') )

                <nav class="offcanvas__navigation">

                    @include( 'partials.navigation', ['menu_items' => $navigation['primary'] ] )

                </nav>

            @endif

        </div>

    </div>

</div>