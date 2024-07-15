<?php

namespace App\Fields\SettingsPages;

use StoutLogic\AcfBuilder\FieldsBuilder;

class BrandSettings {

	public function __construct() {

		/**
		 * Logo Assets
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$logoAssets = new FieldsBuilder('logo_assets', [
			'title'			=> 'Logo Assets',
			'menu_order'	=>	1
		]);

		$logoAssets

			->addImage('brand_logo', [
				'label'			=> 'Full Logo',
				'preview_size'	=> 'medium'
			])

			->addImage('favicon', [
				'label'			=> 'Favicon',
				'preview_size'	=> 'medium',
				'mime_types' 	=> 'png, svg, ico'
			])

			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Logo Assets
		add_action('acf/init', function() use ($logoAssets) {
			acf_add_local_field_group($logoAssets->build());
		});


		/**
		 * Business Information
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$businessInformation = new FieldsBuilder('business_information', [
			'title'			=> 'Business Information',
			'menu_order'	=>	5
		]);

		$businessInformation

			->addField('primary_phone_number', 'acfe_phone_number', [
				'label' 			=> 'Primary Phone Number',
				'default_country' 	=> 'us',
				'return_format'		=> 'array',
				'placeholder'		=> '{placeholder}',
				'wrapper'			=> [
					'width'			=> '50'
				]
			])

			->addEmail('primary_email_address', [
				'label' 	=> 'Primary Email Address',
				'wrapper'	=> [
					'width'	=> '50'
				]
			])
			
			->addGroup('physical_address', [
				'label'		=> 'Physical Address',
			])

				->addText('street1', [
					'label' => 'Street 1'
				])

				->addText('street2', [
					'label' => 'Street 2'
				])

				->addText('city', [
					'label' => 'City'
				])

				->addText('state', [
					'label' => 'State'
				])

				->addText('zip', [
					'label' => 'Postal Code'
				])
			
			->endGroup()

			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Business Information
		add_action('acf/init', function() use ($businessInformation) {
			acf_add_local_field_group($businessInformation->build());
		});


		/**
		 * Social Networks
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$socialNetworks = new FieldsBuilder('social_networks', [
			'title'			=> 'Social Networks',
			'menu_order'	=>	10
		]);

		$socialNetworks

			->addText('facebook', [
				'label' 	=> 'Facebook',
				'prepend' 	=> 'URL',
			])
			
			->addText('twitter', [
				'label' 	=> 'Twitter',
				'prepend' 	=> 'URL',
			])
			
			->addText('linkedin', [
				'label' 	=> 'Linkedin',
				'prepend' 	=> 'URL',
			])
			
			->addText('instagram', [
				'label' 	=> 'Instagram',
				'prepend' 	=> 'URL',
			])
			
			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Social Networks
		add_action('acf/init', function() use ($socialNetworks) {
			acf_add_local_field_group($socialNetworks->build());
		});

		/**
		 * Global Footer
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$globalFooter = new FieldsBuilder('global_footer', [
			'title'			=> 'Footer',
			'menu_order'	=>	15
		]);

		$globalFooter

			->addWysiwyg('footer_copyright', [
				'label'			=> 'Copyright',
				'tabs'			=> 'all',
				'toolbar'		=> 'full',
				'media_upload' 	=> 0
			])

			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Global Footer
		add_action('acf/init', function() use ($globalFooter) {
			acf_add_local_field_group($globalFooter->build());
		});

		/**
		 * Script Manager
		 * 
		 */
		$scriptManager = new FieldsBuilder('script-manager', [
			'title'			=> 'Script Manager',
			'menu_order'	=>	20
		]);

		$scriptManager

			->addRepeater('global_scripts', [
				'label'         => false,
				'layout'		=> 'block',
				'collapsed'		=> 'type',
				'button_label'	=> 'Add Script',
				'acfe_repeater_stylised_button'	=> 1
			])

				->addSelect('type', [
					'label'   => false,
					'choices' => [
						'google_tag_manager' => 'Google Tag Manager',
						'google_site_verification' => 'Google Site Verification',
						'custom' => 'Custom'
					],
					'wrapper'			=> [
						'width'			=> '30'
					]
				])

				// Google Tag Manager

				->addText('google_tag_manager_id', [
					'label' => false,
					'placeholder' => 'Tag Manager ID',
					'wrapper'			=> [
						'width'			=> '70'
					]
				])
					->conditional('type', '==', 'google_tag_manager')

				// Google Site Verification

				->addText('google_site_verification_id', [
					'label' => false,
					'placeholder' => 'Site Verification ID',
					'wrapper'			=> [
						'width'			=> '70'
					]
				])
					->conditional('type', '==', 'google_site_verification')

				// Custom

				->addText('custom_script_title', [
					'label' => false,
					'placeholder'    => 'Title',
					'wrapper'			=> [
						'width'			=> '70'
					]
				])
					->conditional('type', '==', 'custom')

				->addField('custom_script', 'acfe_code_editor', [
					'label' 	=> 'Custom Script',
					'rows'		=> 4
				])
					->conditional('type', '==', 'custom')

				->addRadio('custom_script_location', [
					'label' 		=> 'Location',
					'choices'		=> [
						'header' 	=> 'Header',
						'footer' 	=> 'Footer'
					],
					'layout' 		=> 'horizontal'
				])
					->conditional('type', '==', 'custom')

			->endRepeater()

			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Script Manager
		add_action('acf/init', function() use ($scriptManager) {
			acf_add_local_field_group($scriptManager->build());
		});

		/**
		 * Global Inline Styles
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$globalInlineStyles = new FieldsBuilder('global_inline_styles', [
			'title'			=> 'Global Inline Styles',
			'menu_order'	=>	25
		]);

		$globalInlineStyles

			->addField('global_inline_styles', 'acfe_code_editor', [
				'label'		=> 'CSS Editor',
				'mode' 		=> 'css',
				'rows' 		=> 2,
				'max_rows'  => 4
			])
			
			->setLocation('options_page', '==', 'acf-options-brand-settings');

		// Register Analytics
		add_action('acf/init', function() use ($globalInlineStyles) {
			acf_add_local_field_group($globalInlineStyles->build());
		});

	}

}