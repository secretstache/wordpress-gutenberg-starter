<?php

namespace App\Blocks;
use App\View\Composers\SSM;

class BlogFeed extends Block
{
    public const QUERY_LATEST = 'latest';
    public const QUERY_CURATED = 'curated';
    public const QUERY_BY_CATEGORY = 'by_category';

    protected function prepareData($attributes, $content): array
    {
        $query              = $attributes['queryType'] ?? self::QUERY_LATEST;
        $number_posts       = $attributes['numberOfPosts'] ?? -1;
        $curated_posts      = $attributes['curatedPosts'] ?? [];
        $curated_terms      = $attributes['curatedTerms'] ?? [];
        $is_show_filters    = $attributes['isShowFilters'] ?? false;

        $args = [
            'data_source'       => 'posts',
            'query'             => $query,
            'taxonomy_slug'     => 'category',
            'curated_terms'     => $curated_terms,
            'number_posts'      => $query === self::QUERY_CURATED ? -1 : $number_posts,
            'curated_posts'     => $curated_posts,
            'excluded_posts'    => [get_the_ID()],
            'prefix'            => 'ssm'
        ];

        $is_empty_selection = ($query === self::QUERY_CURATED && empty($curated_posts)) ||
            ($query === self::QUERY_BY_CATEGORY && empty($curated_terms)) ||
            ($query !== self::QUERY_CURATED && $number_posts === 0);

        if ($is_show_filters && $query === self::QUERY_LATEST) {
            $extra_args = ['facetwp' => true];
        }

        $posts = $is_empty_selection ? [] : SSM::getPosts($args, $extra_args ?? []);

        $data = [
            'wrapper_attributes'    => get_block_wrapper_attributes(),
            'posts'                 => $posts,
            'include_filters'       => $is_show_filters && $query === self::QUERY_LATEST,
        ];

        return $data;
    }
}
