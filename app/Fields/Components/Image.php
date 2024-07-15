<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Image {

	public static function getFields() {

		/**
         * [Component] - Image
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
         */
        $imageComponent = new FieldsBuilder('image');

        $imageComponent

            ->addImage('image', [
                'label'			=> 'Upload Image',
                'preview_size'	=> 'large',
            ]);

		return $imageComponent;

	}

}