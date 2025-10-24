<?php

/**
 * Theme filters.
 */

namespace App;

/**
 * Add "… Continued" to the excerpt.
 *
 * @return string
 */
add_filter('excerpt_more', function () {
    return sprintf(' &hellip; <a href="%s">%s</a>', get_permalink(), __('Continued', 'sage'));
});

/**
 * Extend Gutenberg Image Block to support mobile image
 */
add_filter( 'render_block', function ( $html, $block ) {
    if ( ($block['blockName'] ?? '') !== 'core/image' ) return $html;
    if ( stripos( $html, '<picture' ) !== false ) return $html;

    $attrs  = $block['attrs'] ?? [];
    $mobile = $attrs['mobileImage'] ?? null;
    if ( empty( $mobile ) ) return $html;

    $mid  = intval( $mobile['id'] ?? 0 );
    $murl = $mobile['url'] ?? '';
    if ( ! $mid || ! $murl ) return $html;

    $size  = $attrs['sizeSlug'] ?? 'full';
    $msrc  = '';
    $mset  = '';
    $msize = '';

    if ( $mid ) {
        if ( $src = wp_get_attachment_image_src( $mid, $size ) ) $msrc = esc_url( $src[0] );
        if ( $set = wp_get_attachment_image_srcset( $mid, $size ) ) $mset = esc_attr( $set );
        if ( $sz  = wp_get_attachment_image_sizes( $mid, $size ) ) $msize = esc_attr( $sz );
    } else {
        $msrc = esc_url( $murl );
    }
    if ( ! $msrc && ! $mset ) return $html;

    $source = '<source media="(max-width: 767px)" ' .
        ( $mset ? 'srcset="' . $mset . '"' : 'srcset="' . $msrc . '"' ) .
        ( $msize ? ' sizes="' . $msize . '"' : '' ) .
        '>';

    $pattern = '#<img\b[^>]*>#i';
    $replacement_cb = function( $m ) use ( $source ) {
        return '<picture>' . $source . $m[0] . '</picture>';
    };

    $updated = preg_replace_callback( $pattern, $replacement_cb, $html, 1 );
    return $updated ?: $html;
}, 10, 2 );
