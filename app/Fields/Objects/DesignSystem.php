<?php

namespace App\Fields\Objects;

use StoutLogic\AcfBuilder\FieldsBuilder;

class DesignSystem {

	public function __construct() {

        /**
		 * Design System Info
		 */
		$designSystemInfo = new FieldsBuilder('ds_info', [
			'title'     => 'Design System Info',
			'position'  => 'side',
			'style'		=> 'seamless'
		]);

		$designSystemInfo

            ->addTaxonomy('ds_type', [
                'label'         => 'Choose Type',
                'taxonomy'      => 'ssm_ds_type',
                'field_type'    => 'select',
                'allow_null'    => 1,
                'add_term'      => 1,
                'save_terms'    => 1,
                'load_terms'    => 1,
                'multiple'      => 0,
                'return_format' => 'object'
            ])

			->setLocation('post_type', '==', 'ssm_design_system')
				->and('page_template', '!=', 'template-design-system-archive-page.blade.php');

		// Register Design System Info
		add_action('acf/init', function() use ($designSystemInfo) {
			acf_add_local_field_group($designSystemInfo->build());
		});

        /**
		 * Design System Archive Info
		 */
		$designSystemArchiveInfo = new FieldsBuilder('design_system_archive_info', [
			'title'     => 'Design System Archive Info',
			'position'  => 'acf_after_title',
			'style'     => 'seamless'
		]);

		$designSystemArchiveInfo

			->addTaxonomy('design_system_archive_types', [
				'label'         => 'Types to show',
				'taxonomy'      => 'ssm_ds_type',
				'field_type'    => 'multi_select',
				'allow_null'    => 0,
				'add_term'      => 0,
				'save_terms'    => 0,
				'load_terms'    => 0,
				'multiple'      => 1,
				'return_format' => 'object'
			])

			->addWysiwyg('design_system_archive_above', [
				'label'        => 'Content Above Archive',
				'toolbar'      => 'basic',
				'media_upload' => '0'
			])

			->addWysiwyg('design_system_archive_below', [
				'label'        => 'Content Below Archive',
				'toolbar'      => 'basic',
				'media_upload' => '0'
			])

			->addField('design_system_archive_message', 'message', [
				'label'     => false,
				'message'   => '<b>No other input is required. The list of design system items sorted by type will be displayed on this page.</b>',
			])

			->setLocation('post_type', '==', 'ssm_design_system')
				->and('page_template', '==', 'template-design-system-archive-page.blade.php');

		// Register Design System Archive Info
		add_action('acf/init', function() use ($designSystemArchiveInfo) {
			acf_add_local_field_group($designSystemArchiveInfo->build());
		});

    }

}