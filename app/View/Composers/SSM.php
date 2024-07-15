<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use \Log1x\Navi\Navi;
use Roots\Acorn\View\Composers\Concerns\AcfFields;

class SSM extends Composer
{
    use AcfFields;

    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        '*',
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {

        $footer_menus = [];

        if( ( $menu_columns = get_field( 'footer_menus', 'options' ) ) && is_array( $menu_columns ) && !empty( $menu_columns ) ) {

            foreach( $menu_columns as $column ) {
                $footer_menus[] = [
                    'nav_menu' => Navi::build( $column['nav_menu']->term_id )->toArray(),
                    'headline' => $column['headline']
                ];
            }

        }

        return [
            'builder'       => $this->getBuilder(),
            'navigation'    => [
                'primary'   => Navi::make()->build('primary_navigation')->toArray(),
                'footer'    => $footer_menus
            ],
            'logo_assets'           => [
                'brand_logo'        => get_field('brand_logo', 'options'),
                'favicon'           => get_field('favicon', 'options')
            ],
            'business_information'  => [
                'phone_number'      => get_field( 'primary_phone_number', 'options' ),
                'email_address'     => get_field( 'primary_email_address', 'options' ),
                'physical_address'  => get_field( 'physical_address', 'options' )
            ],
            'social_networks'       => [
                'facebook'          => get_field( 'facebook', 'options' ),
                'twitter'           => get_field( 'twitter', 'options' ),
                'linkedin'          => get_field( 'linkedin', 'options' ),
                'instagram'         => get_field( 'instagram', 'options' )
            ],
            'footer'                => [
                'copyright'         => get_field( 'footer_copyright', 'options' )
            ],
            'is_landing_page'       => is_page_template('template-landing-page.blade.php')
        ];

    }

    /**
     * Returns builder
     *
     * @return object
     */
    public function getBuilder() {
        return $this;
    }

    public static function getCustomID( $html_id )
    {
        return ( !empty( $html_id ) ) ? " id=\"". sanitize_html_class( strtolower( $html_id ) ) ."\"" : "";
    }

    public static function getColorChoices($colors)
    {

        if ( !empty( $colors ) ) {

            foreach ( $colors as $color ) {
                $choices[$color] = get_stylesheet_directory_uri(__FILE__) . '/resources/assets/swatches/' . $color . '.png';
            }
            
        }

        return $choices ?? [];
    }

    public static function getAddress( $address )
	{
        $response = '';

        if ( $address['street1'] || $address['street2'] || $address['city'] || $address['state'] || $address['zip'] ) {
            $response .= ( $address['street1'] ) ? $address['street1'] . ", " : "";
            $response .= ( $address['street2'] ) ? $address['street2'] : "";
            $response .= ( $address['city'] ) ? "<br />" . $address['city'] : "";
            $response .= ( $address['state'] ) ? ", " . $address['state'] : "";
            $response .= ( $address['zip'] ) ? " " . $address['zip'] : "";
        }

        return $response;
    }

    public static function getPhoneNumber( $phone )
	{
        $formatted = '';

        if( preg_match( '/^\+\d(\d{3})(\d{3})(\d{4})$/', $phone['national'], $pieces ) ) {
            return $pieces[1] . '-' . $pieces[2] . '-' . $pieces[3];
        }

        return $formatted;
    }

    public static function getPageTemplateID( $page_template )
    {

        $post = get_posts( ['post_type' => 'page', 'meta_key' => '_wp_page_template', 'meta_value' => $page_template] );
        
        return $post ? array_shift( $post )->ID : '';

    }

}
