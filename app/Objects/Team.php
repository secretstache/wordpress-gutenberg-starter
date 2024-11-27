<?php

namespace App\Objects;

/**
 * Add Team CPT
 */
add_action( 'init', function() {

    register_extended_post_type( "ssm_team", [

        "capability_type"   => "page",
        "menu_icon"         => "dashicons-groups",
        "menu_position"		=> 5,
        "supports" 			=> ["title"],
        "show_in_menu"      => "ssm",
        "has_archive"       => false,
        "public"            => false,
        "show_ui"           => true,

        "labels"            => [
            "all_items"     => "Team",
        ],

        "admin_cols"        => [ // admin posts list columns
            "team_headshot_col"  => [
                'title'          => 'Headshot',
                'featured_image' => 'thumbnail',
                'function'       => function() {
                    echo ( $headshot = ( get_field( 'team_headshot', get_the_ID() ) ) ) ? '<img height="80" src="' . $headshot['url'] . '" />' : '<div class="custom-dash">—</div>' ;
                }
            ],
            "title"
        ],

    ], [

        "singular"  => "Team Member",
        "plural"    => "Team",
        "slug"      => "team"

    ] );

});

/**
 * Move Thumbnail Column for Team Member CPT
 */
add_filter( 'manage_ssm_team_posts_columns', function( $columns ) {

    unset( $columns["title"] );

    $new_columns = array_slice($columns, 0, 2, true) + array("title" => "Title") + array_slice($columns, 2, count($columns) - 1, true);

    return $new_columns;

}, 99, 1);

/**
 * Register Taxonomy Category
 */
add_action( 'init', function() {

    register_extended_taxonomy( "ssm_team_category", "ssm_team", [

        "hierarchical" => false

    ], [

        "singular"  => "Category",
        "plural"    => "Categories",
        "slug"      => "team-category"

    ] );

});

/**
 * Allow sorting by first/last name
 */
//add_filter('rest_ssm_team_collection_params', function ($query_params) {
//    // Add meta_value as an allowed option for orderby
//    $query_params['orderby']['enum'][] = 'meta_value';
//
//    return $query_params;
//} );
//
//add_filter('rest_ssm_team_query', function ($args, $request) {
//    if (isset($request['orderby']) && isset($request['meta_key']) && $request['orderby'] === 'meta_value') {
//        $args['orderby'] = 'meta_value';
//        $args['meta_key'] = sanitize_text_field($request['meta_key']);
//    }
//
//    return $args;
//}, 10, 2);
