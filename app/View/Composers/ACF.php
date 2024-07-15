<?php

namespace App\View\Composers;

use Roots\Acorn\View\Composer;
use Roots\Acorn\View\Composers\Concerns\AcfFields;

class ACF extends Composer
{
    use AcfFields;

    /**
     * List of views served by this composer.
     *
     * @var array
     */
    protected static $views = [
        '*'
    ];

    /**
     * Data to be passed to view before rendering.
     *
     * @return array
     */
    public function with()
    {
        return [];
    }
}
