<?php

namespace App\Fields\Objects;

use StoutLogic\AcfBuilder\FieldsBuilder;

class LegalPage {

	public function __construct() {

        /**
		 * Legal Info
		 */
		$legalInfo = new FieldsBuilder('legal_info', [
            'title'    => 'Page Info',
			'position' => 'acf_after_title',
            'style'    => 'seamless'
		]);

		$legalInfo

            ->addWysiwyg('legal_editor',[
                'label'         => false,
                'tabs'          => 'all',
                'toolbar'       => 'full',
                'media_upload'  => 1,
            ])

			->setLocation('post_template', '==', 'template-legal-page.blade.php');

		// Register Legal Info
		add_action('acf/init', function() use ($legalInfo) {
			acf_add_local_field_group($legalInfo->build());
		});

    }

}
