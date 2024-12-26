<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Gallery {

	public static function getFields() {

		/**
         * [Component] - Gallery
         */
        $galleryComponent = new FieldsBuilder('gallery');

        $galleryComponent
        
            ->addGallery('gallery', [
                'label'	=> false
            ]);

		return $galleryComponent;

	}

}