<?php

namespace App\Fields\SettingsPages;

use StoutLogic\AcfBuilder\FieldsBuilder;

class DesignSystemSettings {

	public function __construct() {

        /**
		 * Global Settings
         * 
		 */
		$globalSettings = new FieldsBuilder('ds_global_settings', [
			'title'			=> 'Global Settings',
			'menu_order'	=>	1
		]);

		$globalSettings

            ->addTrueFalse('ds_require_auth', [
                'label'		=> false,
                'message'	=> 'Require authentication to view Design System',
                'default_value' => 1
            ])

			->setLocation('options_page', '==', 'design-system-settings');

		// Register Global Settings
		add_action('acf/init', function() use ($globalSettings) {
			acf_add_local_field_group($globalSettings->build());
		});

    }

}