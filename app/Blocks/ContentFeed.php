<?php

namespace App\Blocks;

use App\View\Composers\Gutenberg;

class ContentFeed extends Block
{
    protected function prepareData(array $data): array
    {

        $data_source   = $data['attributes']['dataSource'] ?? 'news'; // news, resources
        $query         = $data['attributes']['queryType'] ?? 'latest'; // latest, latest_by_category, curated
        $number_posts  = $data['attributes']['numberOfPosts'] ?? 5;
        $categories    = $data['attributes']['selectedCategories'] ?? [];
        $curated_posts = $data['attributes']['curatedPosts'] ?? '';

        $posts = Gutenberg::getPosts( [
            'data_source'       => $data_source, 
            'query'             => $query, 
            'number_posts'      => $number_posts, 
            'taxonomy_name'     => $data_source == 'resources' ? 'category' : 'ssm_news_category', 
            'selected_terms'    => $categories, 
            'curated_posts'     => $curated_posts, 
            'prefix'            => 'ssm'
        ]);

        $data = [
            'wrapper_attributes'    => get_block_wrapper_attributes(),
            'title'                 => $data['attributes']['title'] ?? [],
            'posts'                 => $posts ?? [],
            'attributes'            => $data['attributes'] ?? []
        ];

        return $data;
    }
}