<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Image {

	public static function getFields() {

		/**
         * [Component] - Image
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