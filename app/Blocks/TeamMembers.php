<?php

namespace App\Blocks;

use App\View\Composers\SSM;

class TeamMembers extends Block
{
    // TODO: add to the acf the fist name and last name, order ASC by last name
    protected function prepareData($attributes, $content): array
    {
        $query = $attributes['queryType'] ?? 'all';
        $number_posts = $attributes['numberOfPosts'] ?? -1;
        $curated_posts = $attributes['curatedPosts'] ?? [];

        $args = [
            'data_source'           => 'team',
            'query'                 => $query,
            'number_posts'          => $number_posts,
            'curated_posts'         => $curated_posts,
            'order'                 => 'ASC',
            'orderby'               => 'title',
            'prefix'                => 'ssm'
        ];

        $posts = SSM::getPosts($args);

        $data = [
            'wrapper_attributes'    => get_block_wrapper_attributes(),
            'query'                 => $query,
            'number_posts'          => $number_posts,
            'posts'                 => $posts,
            'args'                  => $args,
        ];

        return $data;
    }
}
