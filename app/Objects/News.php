<?php

namespace App\Objects;

/**
 * Add News CPT
 */
add_action('init', function () {

    register_extended_post_type("ssm_news", [

        "capability_type"   => "page",
        "menu_icon"         => "dashicons-admin-comments",
        "menu_position"        => 5,
        "supports"             => ["title", "editor"],
        "show_in_menu"      => 'ssm',
        "has_archive"       => false,
        "public"            => false,
        "show_ui"           => true,
        "hierarchical"      => false,
        "show_in_rest"      => true,

        "labels"            => [
            "all_items"     => "News",
        ],

        "admin_cols"        => [ // admin posts list columns
            "title"
        ],

    ], [

        "singular"  => "News Entry",
        "plural"    => "News",
        "slug"      => "news"

    ]);

    /**
     * Register FAQ Category Taxonomy
     */
    register_extended_taxonomy("ssm_news_category", "ssm_news", [
        'show_in_rest' => true,
        "hierarchical"      => false,
        "show_admin_column" => true,

    ], [

        "singular"  => "Category",
        "plural"    => "Categories",
        "slug"      => "news-category"

    ]);
});
