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

function ssm_restrict_block_types( $allowed_blocks, $block_editor_context ) {
    $restrictedBlocks = [

    ];

    if ( isset($block_editor_context->post) ) {
        $post_type = $block_editor_context->post->post_type;

        if ( $post_type === 'post' || $post_type === 'page' ) {
            // If allowed_blocks is boolean true (all blocks are allowed), then fetch all registered blocks
            if ( $allowed_blocks === true ) {
                $allowed_blocks = array_keys( \WP_Block_Type_Registry::get_instance()->get_all_registered() );
            }

            foreach ( $allowed_blocks as $key => $value ) {
                if ( in_array($value, $restrictedBlocks) ) {
                    unset( $allowed_blocks[$key] );
                }
            }

            return array_values( $allowed_blocks );
        }
    }

    return $allowed_blocks;
}

add_filter( 'allowed_block_types_all', 'ssm_restrict_block_types', 10, 2 );


/**
 * Boot SSM Core
 */
$core = new SSM\Core();
$core->setup();

add_filter('upload_mimes', function ($mimes) {
    $mimes['json'] = 'text/plain';

    return $mimes;
});
