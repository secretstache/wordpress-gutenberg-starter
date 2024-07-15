<?php

/**
* Google Tag Manager
*
*/

add_action( 'wp_head', function() {

    if ( ( $global_scripts = get_field('global_scripts', 'options') ) && is_array( $global_scripts ) && !empty( $global_scripts ) ) {

        foreach( $global_scripts as $script ) {

            if( $script['type'] == 'google_tag_manager' && $script['google_tag_manager_id'] ) { ?>

                <!-- Begin Google Tag Manager -->

                <script>
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":
                    new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src=
                    "//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,"script","dataLayer","<?php echo $script['google_tag_manager_id']; ?>");
                </script>

                <!-- End Google Tag Manager -->

            <?php }

        }
		
	}

}, 99 );

add_action( 'wp_body_open', function() {

if ( ( $global_scripts = get_field('global_scripts', 'options') ) && is_array( $global_scripts ) && !empty( $global_scripts ) ) {

        foreach( $global_scripts as $script ) {

            if( $script['type'] == 'google_tag_manager' && $script['google_tag_manager_id'] ) {
                echo "<noscript><iframe src=\"//www.googletagmanager.com/ns.html?id=" . $script['google_tag_manager_id'] . "\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>";
            }
            
        }

    }


} );

/**
* Google Site Verification
*
*/

add_action( 'wp_head', function() {

    if ( ( $global_scripts = get_field('global_scripts', 'options') ) && is_array( $global_scripts ) && !empty( $global_scripts ) ) {

        foreach( $global_scripts as $script ) {
        
            if( $script['type'] == 'google_site_verification' && $script['google_site_verification_id'] ) { ?>

                <!-- Begin Google Search Console Verification -->
                <meta name="google-site-verification" content="<?php echo $script['google_site_verification_id']; ?>" />
                <!-- End Begin Google Search Console Verification -->

            <?php }
        
        }

    }

}, 1 );

/**
* Custom Scripts
*
*/

// Head Scripts

add_action( 'wp_head', function() {

    if ( ( $global_scripts = get_field('global_scripts', 'options') ) && is_array( $global_scripts ) && !empty( $global_scripts ) ) {

        foreach( $global_scripts as $script ) {

            if( $script['type'] == 'custom' && $script['custom_script'] && $script['custom_script_location'] == 'header' ) {
                echo $script['custom_script'];
            }

        }

    }

}, 99 );

// Footer Scripts

add_action( 'wp_footer', function() {

    if ( ( $global_scripts = get_field('global_scripts', 'options') ) && is_array( $global_scripts ) && !empty( $global_scripts ) ) {

        foreach( $global_scripts as $script ) {

            if( $script['type'] == 'custom' && $script['custom_script'] && $script['custom_script_location'] == 'footer' ) {
                echo $script['custom_script'];
            }

        }

    }

}, 99 );