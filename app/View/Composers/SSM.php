<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use Log1x\Navi\Facades\Navi;
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
                    'nav_menu' => Navi::build( (int)$column['menu_id'] )->toArray(),
                ];
            }

        }

        return [
            'builder'       => $this->getBuilder(),
            'navigation'    => [
                'primary'   => Navi::make()->build('primary_navigation')->toArray(),
                'legal'     => Navi::make()->build('legal_navigation')->toArray(),
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

    public static function getPosts( $data, $extra_args = [] )
    {

        $args = [
            'post_type'      => ( $data['data_source'] && $data['data_source'] !== 'posts' && $data['data_source'] !== 'resources' ) ? $data['prefix'] . '_' . $data['data_source'] : 'post',
            'posts_per_page' => $data['number_posts'] ?? -1,
            'post__not_in'   => $data['excluded_posts'] ?? [],
            'status'         => 'publish',
            'fields' 	     => 'ids',
        ];

        if( isset($data['order']) && isset($data['orderby']) && $data['query'] != 'curated' ){

            $orderby_args = [
                'order'      => $data['order'],
                'orderby'    => $data['orderby']
            ];

            $args = array_merge(
                $args,
                $orderby_args
            );

        }

        // TODO: too long and difficult to understand, refactor
        if ( isset($data['taxonomy_slug']) && isset($data['curated_terms']) && !empty($data['curated_terms']) && $data['query'] == 'by_' . str_replace( $data['prefix'] . '_', '', $data['taxonomy_slug'] ) ) {

            $taxonomy_args = [
                'tax_query' => [
                    [
                        'taxonomy' => $data['taxonomy_slug'],
                        'field'    => 'term_id',
                        'terms'    => $data['curated_terms'],
                    ]
                ]
            ];

            $args = array_merge(
                $args,
                $taxonomy_args
            );


        } elseif ($data['query'] == 'curated' && isset( $data['curated_posts'] ) && !empty( $data['curated_posts'] ) ) {

            $post_in = is_array($data['curated_posts'][0]) ? array_column($data['curated_posts'], 'value') : $data['curated_posts'];

            $curated_args = [
                'post__in'      => $post_in,
                'orderby'       => 'post__in'
            ];

            $args = array_merge(
                $args,
                $curated_args
            );

        }

        if (!empty($extra_args) && is_array($extra_args)) {
            $args = array_merge($args, $extra_args);
        }

        $posts = get_posts($args);

        return $posts;

    }

    public static function getSpacingClasses(
        array $attributes,
        string $desktopPrefix = 'md:',
        string $mobilePrefix = '',
        string $valuePrefix = ''
    ): string {
        $SKIP = -1;

        $spacing = $attributes['spacing'] ?? null;

        $buildClass = static function ($prefix, $property, $valuePrefixLocal, $value) use ($SKIP) {
            if ($value === $SKIP) {
                return null;
            }
            return sprintf('%s%s-%s%s', (string)$prefix, $property, (string)$valuePrefixLocal, (string)$value);
        };

        $candidates = [
            $buildClass($desktopPrefix, 'mt', $valuePrefix, $spacing['desktop']['margin']['top'] ?? null),
            $buildClass($desktopPrefix, 'mb', $valuePrefix, $spacing['desktop']['margin']['bottom'] ?? null),
            $buildClass($desktopPrefix, 'pt', $valuePrefix, $spacing['desktop']['padding']['top'] ?? null),
            $buildClass($desktopPrefix, 'pb', $valuePrefix, $spacing['desktop']['padding']['bottom'] ?? null),
            $buildClass($mobilePrefix, 'mt', $valuePrefix, $spacing['mobile']['margin']['top'] ?? null),
            $buildClass($mobilePrefix, 'mb', $valuePrefix, $spacing['mobile']['margin']['bottom'] ?? null),
            $buildClass($mobilePrefix, 'pt', $valuePrefix, $spacing['mobile']['padding']['top'] ?? null),
            $buildClass($mobilePrefix, 'pb', $valuePrefix, $spacing['mobile']['padding']['bottom'] ?? null),
        ];

        $filtered = array_values(array_filter($candidates, static function ($v) {
            return is_string($v) && strlen($v) > 0;
        }));

        return implode(' ', $filtered);
    }
}
