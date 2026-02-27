<?php

namespace App\Blocks;

use App\View\Composers\SSM;

class Testimonials extends Block
{
    public const QUERY_LATEST = 'all';
    public const QUERY_CURATED = 'curated';

    protected function prepareData($attributes, $content): array
    {
        $query         = $attributes['queryType'] ?? self::QUERY_LATEST;
        $number_posts  = $attributes['numberOfPosts'] ?? -1;
        $curated_posts = $attributes['curatedPosts'] ?? [];

        $args = [
            'data_source'       => 'ssm_testimonial',
            'query'             => $query,
            'number_posts'      => $query === self::QUERY_CURATED ? -1 : $number_posts,
            'curated_posts'     => $curated_posts,
            'excluded_posts'    => [get_the_ID()],
        ];

        $is_empty_selection = ($query === self::QUERY_CURATED && empty($curated_posts)) ||
            ($query !== self::QUERY_CURATED && $number_posts === 0);

        $posts = $is_empty_selection ? [] : SSM::getPosts($args);

        return [
            'wrapper_attributes'    => get_block_wrapper_attributes(),
            'posts'                 => $posts,
        ];
    }
}
