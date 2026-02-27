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

    public static function getPosts($data, $extra_args = [])
    {
        $data_source = $data['data_source'] ?? 'posts';
        $query       = $data['query'] ?? 'latest';
        $post_type   = in_array($data_source, ['posts', 'resources'], true)
            ? 'post'
            : $data_source;

        $args = [
            'post_type'      => $post_type,
            'posts_per_page' => $data['number_posts'] ?? -1,
            'post__not_in'   => $data['excluded_posts'] ?? [],
            'post_status'    => 'publish',
            'fields'         => 'ids',
        ];

        $taxonomy = $data['taxonomy_slug'] ?? null;
        $terms    = $data['curated_terms'] ?? [];

        if ($taxonomy && !empty($terms) && $query === $taxonomy) {

            $args['tax_query'] = [
                [
                    'taxonomy' => $taxonomy,
                    'field'    => 'term_id',
                    'terms'    => $terms,
                ]
            ];

        } elseif ($query === 'curated' && !empty($data['curated_posts'])) {

            $post_in = is_array($data['curated_posts'][0])
                ? array_column($data['curated_posts'], 'value')
                : $data['curated_posts'];

            $args['post__in'] = $post_in;
            $args['orderby']  = 'post__in';

        } elseif (isset($data['order'], $data['orderby']) && $query !== 'curated') {

            $args['order']   = $data['order'];
            $args['orderby'] = $data['orderby'];

        }

        if (!empty($extra_args)) {
            $args = array_merge($args, $extra_args);
        }

        return get_posts($args);
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

    public static function getBackgroundToneClass(string|null $backgroundType, string|null $backgroundColor):string
    {
        $dark_colors = [
            'black',
        ];

        switch ($backgroundType) {
            case 'image':
            case 'video':
                return 'bg-dark';
            case 'color':
                return $backgroundColor
                    ? in_array( $backgroundColor, $dark_colors ) ? 'bg-dark' : 'bg-light'
                    : '';
            default:
                return '';
        }
    }

    public static function getPostExcerpt($post_id, $word_count = 15)
    {
        $post_excerpt = get_the_excerpt($post_id);

        if (empty($post_excerpt)) {
            $post_content = get_post_field('post_content', $post_id);

            if (str_contains($post_content, 'material-symbols')) {
                $post_content = preg_replace('/<[^>]*class="material-symbols[^"]*"[^>]*>.*?<\/[^>]+>/s', '', $post_content);
            }

            $post_excerpt = !empty($post_content) ? wp_trim_words($post_content, $word_count, '...') : '';
        }

        return $post_excerpt;
    }
}
