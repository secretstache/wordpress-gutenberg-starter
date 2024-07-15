<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Button
{

    public static function getFields()
    {

        /**
         * [Component] - Button
         */
        $buttonComponent = new FieldsBuilder('button');

        $post_types = ['page'];

        $buttonComponent

            ->addRadio('button_source', [
                'label'        => 'Source',
                'layout'       => 'horizontal',
                'choices'      => [
                    'internal' => 'Internal Page',
                    'external' => 'External URL',
                ],
                'wrapper'      => [
                    'width'    => 50
                ]
            ])

            ->addRadio('option_button_target', [
                'label'        => 'Target',
                'layout'       => 'horizontal',
                'choices'      => [
                    '_self'    => 'Default',
                    '_blank'   => 'New Tab',
                ],
                'wrapper'      => [
                    'width'    => 50
                ]
            ])
            ->conditional('button_source', '!=', 'form')

            ->addText('button_label', [
                'label'        => 'Label',
                'wrapper'      => [
                    'width'    => 50
                ]
            ])

            ->addPostObject('button_page_id', [
                'label'        => 'Select a Page',
                'post_type'    => $post_types,
                'wrapper'      => [
                    'width'    => 50
                ],
                'allow_null'   => 1
            ])
            ->conditional('button_source', '==',  'internal')

            ->addText('button_url', [
                'label'        => 'URL',
                'wrapper'      => [
                    'width'    => 50
                ]
            ])
            ->conditional('button_source', '==', 'external');

        return $buttonComponent;
    }
}