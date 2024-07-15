<?php

namespace App\Fields\SettingsPages;

use StoutLogic\AcfBuilder\FieldsBuilder;

class CoreSettings
{

    public function __construct()
    {

        /**
         * Agency Info
         */
        $agencyInfo = new FieldsBuilder('agency_info', [
            'title'      => 'Agency Info',
            'menu_order' => 1
        ]);

        $agencyInfo

            ->addText('agency_name', [
                'label'         => 'Agency Name',
                'placeholder'   => 'Secret Stache Media'
            ])

            ->addText('agency_url', [
                'label'         => 'Agency URL',
                'placeholder'   => 'https://www.secretstache.com/'
            ])

            ->setLocation('options_page', '==', 'acf-options-core');

        // Register Agency Info
        add_action('acf/init', function () use ($agencyInfo) {
            acf_add_local_field_group($agencyInfo->build());
        });

        /**
         * Defaults
         */
        $defaults = new FieldsBuilder('default_info', [
            'title'       => 'Defaults',
            'menu_order'  => 5
        ]);

        $defaults

            ->addImage('login_logo', [
                'label'        => 'Login Logo',
                'preview_size' => 'medium'
            ])

            ->addRepeater('core_scripts', [
                'label'        => 'Core Scripts',
                'layout'       => 'block',
                'button_label' => 'Add Script'
            ])

                ->addText('title', [
                    'label'        => 'Title'
                ])

                ->addField('script', 'acfe_code_editor', [
                    'label'        => 'Script',
                    'rows'         => 4,
                    'max_rows'     => 4
                ])

                ->addCheckbox('locations', [
                    'label'         => 'Location(s)',
                    'choices'       => [
                        'admin'     => 'Admin',
                        'public'    => 'Public'
                    ],
                    'layout'        => 'horizontal'
                ])

            ->endRepeater()

            ->addUser('development_team', [
                'label'         => 'Development Team',
                'multiple'      => 1
            ])

            ->setLocation('options_page', '==', 'acf-options-core');

        // Register Defaults
        add_action('acf/init', function () use ($defaults) {
            acf_add_local_field_group($defaults->build());
        });
    }
}
