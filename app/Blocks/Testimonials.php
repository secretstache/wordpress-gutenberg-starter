<?php

namespace App\Blocks;
use App\View\Composers\SSM;

class Testimonials extends Block
{
    protected function prepareData($attributes, $content): array
    {
        $query              = $attributes['queryType'] ?? 'latest';
        $number_posts       = isset($attributes['numberOfPosts']) && $query == 'latest' ? $attributes['numberOfPosts'] : -1;
        $columns_per_row    = $attributes['columnsPerRow'] ?? 3;
        $layout             = $attributes['layoutType'] ?? 'grid';
        $curated_posts      = $attributes['curatedPosts'] ?? [];

        $posts = SSM::getPosts( [
            'data_source'       => 'testimonial',
            'query'             => $query,
            'number_posts'      => $number_posts,
            'curated_posts'     => $curated_posts,
            'prefix'            => 'ssm'
        ]);

        $classes = ['wp-block-ssm-testimonials'];

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $classes),
        ]);

        $data = [
            'wrapper_attributes'    => $wrapper_attributes,
            'query'                 => $query,
            'number_posts'          => $number_posts,
            'posts'                 => $posts,
            'layout'                => $layout,
        ];

        return $data;
    }

}
