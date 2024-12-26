<?php

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our theme. We will simply require it into the script here so that we
| don't have to worry about manually loading any of our classes later on.
|
*/

if (! file_exists($composer = __DIR__.'/vendor/autoload.php')) {
    wp_die(__('Error locating autoloader. Please run <code>composer install</code>.', 'sage'));
}

require $composer;

/*
|--------------------------------------------------------------------------
| Register The Bootloader
|--------------------------------------------------------------------------
|
| The first thing we will do is schedule a new Acorn application container
| to boot when WordPress is finished loading the theme. The application
| serves as the "glue" for all the components of Laravel and is
| the IoC container for the system binding all of the various parts.
|
*/

if (! function_exists('\Roots\bootloader')) {
    wp_die(
        __('You need to install Acorn to use this theme.', 'sage'),
        '',
        [
            'link_url' => 'https://roots.io/acorn/docs/installation/',
            'link_text' => __('Acorn Docs: Installation', 'sage'),
        ]
    );
}

\Roots\bootloader()->boot();

/*
|--------------------------------------------------------------------------
| Register Sage Theme Files
|--------------------------------------------------------------------------
|
| Out of the box, Sage ships with categorically named theme files
| containing common functionality and setup to be bootstrapped with your
| theme. Simply add (or remove) files from the array below to change what
| is registered alongside Sage.
|
*/

collect(['setup', 'filters', 'core', 'scripts', 'ssm'])
    ->each(function ($file) {
        if (! locate_template($file = "app/{$file}.php", true, true)) {
            wp_die(
            /* translators: %s is replaced with the relative file path */
                sprintf(__('Error locating <code>%s</code> for inclusion.', 'sage'), $file)
            );
        }
    });

/**
 * Boot SSM Core
 */
$core = new SSM\Core();
$core->setup();

add_filter('upload_mimes', function ($mimes) {
    $mimes['json'] = 'text/plain';
    $mimes['lottie'] = 'application/json';
    $mimes['svg'] = 'image/svg+xml';

    return $mimes;
});

add_action( 'init', function () {
    register_post_meta( 'page', 'isShowHeader', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'default' => true,
    ));
});

add_action( 'rest_api_init', function() {
    register_rest_route( 'ssm/v1', '/get-header', array(
        'methods'  => 'GET',
        'callback' => function( WP_REST_Request $request ) {
            return array(
                'html' => view( 'partials.header', [ 'is_editor' => true ] )->render(),
            );
        },
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));
});
