<?php

namespace App\Fields\Objects;

use StoutLogic\AcfBuilder\FieldsBuilder;

class DummyPage
{

    public function __construct()
    {

        /**
         * Dummy Page Info
         */
        $dummyPageInfo = new FieldsBuilder('dummy_page_info', [
            'title'    => 'Page Info',
            'position' => 'acf_after_title',
            'style'    => 'seamless'
        ]);

        $dummyPageInfo

            ->addPostObject('page_redirect', [
                'label'         => 'Page Redirect',
                'post_type'     => ['page']
            ])

            ->setLocation('post_template', '==', 'template-dummy-page.blade.php');

        // Register Dummy Page Info
        add_action('acf/init', function () use ($dummyPageInfo) {
            acf_add_local_field_group($dummyPageInfo->build());
        });
    }
}