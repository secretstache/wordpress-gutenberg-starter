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
        $splide_color       = $data['attributes']['carouselColor']['slug'] ?? false;

        $columns_classname = 'grid-cols-1';
        $columns_classname .= $columns_per_row > 1 ? ' sm:grid-cols-2' : '';
        $columns_classname .= $columns_per_row === 3 ? ' md:grid-cols-' . $columns_per_row : '';
        $columns_classname .= $columns_per_row > 3 ? ' md:grid-cols-' . ( $columns_per_row - 1 ) . ' xl:grid-cols-' . $columns_per_row : '';

        $posts = SSM::getPosts( [
            'data_source'       => 'testimonial',
            'query'             => $query,
            'number_posts'      => $number_posts,
            'curated_posts'     => $data['attributes']['curatedPosts'] ?? [],
            'prefix'            => 'ssm'
        ]);

        $classes = ['wp-block-ssm-testimonials'];

        if ($splide_color) {
            $classes[] = 'splide-color-' . $splide_color;
        }

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $classes),
        ]);

        $data = [
            'wrapper_attributes'    => $wrapper_attributes,
            'query'                 => $query,
            'number_posts'          => $number_posts,
            'posts'                 => $posts,
            'layout'                => $layout,
            'columns_classname'     => $columns_classname
        ];

        return $data;
    }

}
