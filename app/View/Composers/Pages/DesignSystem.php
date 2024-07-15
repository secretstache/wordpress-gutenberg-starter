<?php

namespace App\View\Composers\Pages;

use App\View\Composers\SSM;

class DesignSystem extends SSM
{

    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'template-design-system-archive-page'
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {

        $data      = collect($this->fields())->toArray();
        $posts_arr = [];

        if (!empty($data['design_system_archive_types'])) {

            foreach ($data['design_system_archive_types'] as $type) {

                if ($type && !empty($type->count)) {

                    $args = [
                        'post_type'      => 'ssm_design_system',
                        'posts_per_page' => -1,
                        'status'         => 'publish',
                        'fields'         => 'ids',
                        'orderby'        => 'title',
                        'order'          => 'ASC',
                        'tax_query'      => [
                            [
                                'taxonomy' => 'ssm_ds_type',
                                'terms'    => $type->slug,
                                'field'    => 'slug',
                                'operator' => 'IN'
                            ]
                        ],
                    ];

                    $posts_arr[$type->name] = get_posts($args);
                }
            }
        }

        return [
            'content_above' => $data['design_system_archive_above'],
            'content_below' => $data['design_system_archive_below'],
            'posts_arr'     => $posts_arr,
        ];
    }
}