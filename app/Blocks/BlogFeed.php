<?php

namespace App\Blocks;
use App\View\Composers\SSM;

class BlogFeed extends Block
{

    protected function prepareData($attributes, $content): array
    {
        $query              = $attributes['queryType'] ?? 'latest';
        $number_posts       = $attributes['numberOfPosts'] ?? -1;
        $curated_posts      = $attributes['curatedPosts'] ?? [];
        $curated_terms      = $attributes['curatedTermsIds'] ?? [];

        $posts = SSM::getPosts( [
            'data_source'       => 'posts',
            'query'             => $query,
            'taxonomy_slug'     => 'category',
            'curated_terms'     => $curated_terms,
            'number_posts'      => $number_posts,
            'curated_posts'     => $curated_posts,
            'prefix'            => 'ssm'
        ]);

        $data = [
            'wrapper_attributes'    => get_block_wrapper_attributes(['class' => 'wp-block-ssm-blog-feed']),
            'posts'                 => $posts,
            'number_posts'          => $number_posts,
        ];

        return $data;
    }
}
