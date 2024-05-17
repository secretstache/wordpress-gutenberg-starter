<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;

class Gutenberg extends Composer
{

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

        return [
            'guten_builder' => $this->getBuilder(),
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

    public static function getPosts( $data )
    {

        $args = [
            'post_type'      => ( $data['data_source'] && $data['data_source'] !== 'posts' && $data['data_source'] !== 'resources' ) ? $data['prefix'] . '_' . $data['data_source'] : 'post',
            'posts_per_page' => $data['number_posts'],
            'post__not_in'   => $data['excluded_posts'],
            'status'         => 'publish',
            'fields' 	     => 'ids',
        ];

        $posts = [];
    
        if ( $data['query'] == 'latest' || $data['query'] == 'all' ) {
    
            $posts = get_posts($args);
    
        } elseif ( $data['query'] == 'latest_by_' . str_replace( $data['prefix'] . '_', '', $data['taxonomy_name'] ) && $data['selected_terms']) {
    
            $args['tax_query'] =  [
                [
                    'taxonomy' => $data['taxonomy_name'],
                    'field'    => 'term_id',
                    'terms'    => $data['selected_terms'],
                ]
            ];
    
            $posts = get_posts($args);
    
        } elseif ($data['query'] == 'curated' && !empty( $data['curated_posts'] ) ) {
    
            $posts = array_column($data['curated_posts'], 'value');
    
        }
        
        return $posts;
      
    }

}