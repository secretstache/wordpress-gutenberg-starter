<?php

namespace App\Blocks;
use App\View\Composers\SSM;

class Testimonials extends Block
{
    protected function prepareData(array $data): array
    {
        $query              = $data['attributes']['queryType'] ?? 'latest';
        $number_posts       = isset($data['attributes']['numberOfPosts']) && $query == 'latest' ? $data['attributes']['numberOfPosts'] : -1;
        $columns_per_row    = $data['attributes']['columnsPerRow'] ?? 3;
        $layout             = $data['attributes']['layoutType'] ?? 'grid';

        $posts = SSM::getPosts( [
            'data_source'       => 'testimonial',
            'query'             => $query,
            'number_posts'      => $number_posts,
            'curated_posts'     => $data['attributes']['curatedPosts'] ?? [],
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
