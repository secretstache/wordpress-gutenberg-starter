<?php

namespace App\Blocks;

use App\View\Composers\SSM;

class TeamMembers extends Block
{
    protected function prepareData($attributes, $content): array
    {
        $query         = $attributes['queryType'] ?? 'all';
        $number_posts  = $attributes['numberOfPosts'] ?? -1;
        $curated_posts = $attributes['curatedPosts'] ?? [];

        $args = [
            'data_source'           => 'team',
            'query'                 => $query,
            'number_posts'          => $query == 'curated' ? -1 : $number_posts,
            'curated_posts'         => $curated_posts,
            'prefix'                => 'ssm'
        ];

        if ($query == 'all' && $number_posts != 0) {

            $orderby_args = [
                'meta_key'       => 'team_last_name',
                'orderby'        => 'meta_value title',
                'order'          => 'ASC',
            ];

            $posts = SSM::getPosts($args, $orderby_args);

        } elseif ($query == 'curated' && !empty($curated_posts)) {
            $posts = SSM::getPosts($args);
        }

        $data = [
            'wrapper_attributes'    => get_block_wrapper_attributes(),
            'posts'                 => $posts ?? [],
        ];

        return $data;
    }
}
