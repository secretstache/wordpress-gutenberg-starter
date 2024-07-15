<?php

namespace App\Objects;

/**
 * Add Design System CPT
 */
add_action( 'init', function() {

    register_extended_post_type( "ssm_design_system", [

        "capability_type"       => "page",
        "menu_icon"             => "dashicons-welcome-widgets-menus",
        "menu_position"		    => 5,
        "supports" 			    => [ "title", "editor", "revisions" ],
        "show_in_menu"          => true,
        "has_archive"           => false,
        "public"                => true,
        "show_ui"               => true,
        "exclude_from_search"   => false,
        "show_in_nav_menus"     => false,
        "show_in_rest"          => true,

        "labels"            => [
            "all_items"     => "Design System",
        ],

        "admin_cols"    => [
            "title",
            "type"      => [
                'label'     => 'Type',
				'taxonomy'  => 'ssm_ds_type'
            ]
        ],

        "admin_filters" => [
			"type"      => [
                'label'     => 'Type',
				'taxonomy'  => 'ssm_ds_type'
            ]
        ]

    ], [

        "singular"  => "Design System Entry",
        "plural"    => "Design System",
        "slug"      => "ds"

    ] );

    // Register Design System Type taxonomy
    register_extended_taxonomy( "ssm_ds_type", "ssm_design_system", [

        "hierarchical"      => false,
        "show_admin_column" => true,

    ], [

        "singular"  => "Type",
        "plural"    => "Types",
        "slug"      => "ds-type"

    ] );

    // Create Design System Settings submenu
    if( class_exists("acf") ) {
        acf_add_options_sub_page( array(
            "page_title"  => "Design System Settings",
            "menu_title"  => "Settings",
            "menu_slug"   => "design-system-settings",
            "parent_slug" => "edit.php?post_type=ssm_design_system",
		));
    }

});

/**
 * Design System - Redirect non-logged in users
 */
add_action('template_redirect', function() {

    $auth_required = get_field( 'ds_require_auth', 'options' );

    if ( get_post_type() == 'ssm_design_system' && $auth_required && $auth_required == true ) {

        if( ! current_user_can('administrator') ) {
            $current_url = home_url( $_SERVER['REQUEST_URI'] );
            $login_url   = wp_login_url( $current_url );
            
            wp_redirect( $login_url );
            exit;
        }

    }

}, 10 );

/**
 * Remove Yoast SEO Metabox
 */
add_action( 'add_meta_boxes', function() {
    remove_meta_box( 'wpseo_meta', 'ssm_design_system', 'normal' );
}, 20 );