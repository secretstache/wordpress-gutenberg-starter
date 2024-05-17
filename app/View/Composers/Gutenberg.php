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
            'posts_per_page' => $data['number_posts'] ?? -1,
            'post__not_in'   => $data['excluded_posts'] ?? [],
            'status'         => 'publish',
            'fields' 	     => 'ids',
        ];
    
        if ( $data['query'] == 'latest_by_' . str_replace( $data['prefix'] . '_' . $data['data_source'] . '_', '', $data['taxonomy_name'] ) && $data['selected_terms'] ) {
    
            $taxonomy_args = [
                'tax_query' => [ 
                    [
                        'taxonomy' => $data['taxonomy_name'],
                        'field'    => 'term_id',
                        'terms'    => $data['selected_terms'],
                    ]
                ]
            ];

            $args = array_merge(
                $args,
                $taxonomy_args
            );
  
    
        } elseif ($data['query'] == 'curated' && !empty( $data['curated_posts'] ) ) {

            $post_in = array_column($data['curated_posts'], 'value');
    
            $curated_args = [
                'post__in'      => $post_in,
                'orderby'       => 'post__in'
            ];
    
            $args = array_merge(
                $args,
                $curated_args
            );
    
        }

        $posts = get_posts($args);
        
        return $posts;
      
    }

}