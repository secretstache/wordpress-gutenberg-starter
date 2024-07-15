<?php

namespace App;

/**
 * Disable unused widgets
 * 
 */
add_action('widgets_init', function () {

    unregister_widget("WP_Widget_Pages");
    unregister_widget("WP_Widget_Calendar");
    unregister_widget("WP_Widget_Meta");
    unregister_widget("WP_Widget_Recent_Posts");
    unregister_widget("WP_Widget_Recent_Comments");
    unregister_widget("WP_Widget_RSS");
    unregister_widget("WP_Widget_Tag_Cloud");
});

/**
 * Remove default dasboards
 * 
 */
add_action('admin_init', function () {

    remove_meta_box("dashboard_right_now", "dashboard", "normal");
    remove_meta_box("dashboard_incoming_links", "dashboard", "normal");
    remove_meta_box("dashboard_plugins", "dashboard", "normal");
    remove_meta_box("dashboard_primary", "dashboard", "side");
    remove_meta_box("dashboard_secondary", "dashboard", "normal");
    remove_meta_box("dashboard_quick_press", "dashboard", "side");
    remove_meta_box("dashboard_recent_drafts", "dashboard", "side");
    remove_meta_box("dashboard_recent_comments", "dashboard", "normal");
    remove_meta_box("dashboard_activity", "dashboard", "normal");
    remove_meta_box("rg_forms_dashboard", "dashboard", "normal");
    remove_meta_box("wpe_dify_news_feed", "dashboard", "normal");
    remove_meta_box("wpseo-dashboard-overview", "dashboard", "normal");
    remove_meta_box("ssm_main_dashboard_widget", "dashboard", "normal");
    remove_action("try_gutenberg_panel", "wp_try_gutenberg_panel");
});

add_action('login_enqueue_scripts', function () {

    $background_image = ($background_image_id = get_option('options_login_logo')) ? wp_get_attachment_url($background_image_id) : SSM_CORE_URL . "assets/images/login-logo.png";

    if ($GLOBALS["pagenow"] === "wp-login.php") :
        ?>
            <style type="text/css">
                body.login div#login h1 a {
                    background-image: url(<?php echo $background_image; ?>) !important;
                    background-repeat: no-repeat;
                    background-size: contain;
                    width: auto;
                    height: 90px;
                    margin-bottom: 15px;
                }
            </style>
        <?php
    endif;
});

/**
 * Makes the login screen"s logo link to your homepage, instead of to WordPress.org
 * 
 */
add_filter('login_headerurl', function ($login_header_url) {
    return home_url();
});

/**
 * Makes the login screen's logo title attribute your site title, instead of "Powered by WordPress".
 * 
 */
add_filter('login_headertext', function ($login_header_text) {
    return get_bloginfo("name");
});

/**
 * Makes WordPress-generated emails appear "from" your WordPress site name, instead of from "WordPress"
 * 
 */
add_filter('wp_mail_from_name', function ($from_name) {
    return get_option("blogname");
});

/**
 * Makes WordPress-generated emails appear "from" your WordPress admin email address
 * 
 */
add_filter('wp_mail_from', function ($from_email) {
    return get_option("admin_email");
});

/**
 * Removes the WP icon from the admin bar
 * 
 */
add_action('wp_before_admin_bar_render', function () {

    global $wp_admin_bar;

    $wp_admin_bar->remove_menu("wp-logo");
});

/**
 * Modify the admin footer text
 *
 */
add_filter('admin_footer_text', function ($text) {

    $agency_name = get_option('options_agency_name') ?: 'Secret Stache Media';
    $agency_url = get_option('options_agency_url') ?: 'https://www.secretstache.com/';

    return 'Built by <a href="' . $agency_url . '" target="_blank">' . $agency_name . '</a> with WordPress.';
}, 99);

/**
 * Add Development Links widget
 *
 */
add_action('wp_dashboard_setup', function () {

    $development_team = get_option('options_development_team');
    $current_user = wp_get_current_user();

    if (is_array($development_team) && in_array($current_user->data->ID, $development_team)) {
        wp_add_dashboard_widget('development_links', 'Development Links', __NAMESPACE__ . '\\developmentLinksWidgetCB');
    }

    function developmentLinksWidgetCB($post, $callback_args)
    {

        $response = '';

        $response .= '<a href="' . admin_url('plugins.php') . '">Plugins</a>';

        $response .= ' | ' . '<a href="' . admin_url('options-general.php?page=acf-options-core') . '">Core Settings</a>';
        $response .= ' | ' . '<a href="' . admin_url('options-general.php?page=menu_editor') . '">Menu Editor Pro</a>';
        $response .= ' | ' . '<a href="' . admin_url('tools.php?page=wp-migrate-db-pro') . '">Migrate DB Pro</a>';

        echo $response;
    }
});

/**
 * Enqueue Core scripts
 *
 */
if( class_exists('acf') ) {

    add_action('wp_head', function () {

        if (is_user_logged_in()) {

            if (($core_scripts = get_field('core_scripts', 'options')) && !empty($core_scripts)) {

                foreach ($core_scripts as $core_script) {

                    if (in_array('public', $core_script['locations']) && $core_script['script']) {
                        echo $core_script['script'];
                    }
                }
            }
        }
    }, 99);

    add_action('admin_head', function () {

        if (is_user_logged_in()) {

            if (($core_scripts = get_field('core_scripts', 'options')) && !empty($core_scripts)) {

                foreach ($core_scripts as $core_script) {

                    if (in_array('admin', $core_script['locations']) && $core_script['script']) {
                        echo $core_script['script'];
                    }
                }
            }
        }
    }, 99);

}