<?php

namespace App\View\Composers\Pages;

use App\View\Composers\SSM;

class Inner extends SSM
{

    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        'single-ssm_design_system'
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {
        $data = collect($this->fields())->toArray();

        return [
            'templates' => $data['templates'] ?? []
        ];
    }
}