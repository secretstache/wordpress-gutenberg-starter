<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Gallery {

	public static function getFields() {

		/**
         * [Component] - Gallery
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
         */
        $galleryComponent = new FieldsBuilder('gallery');

        $galleryComponent
        
            ->addGallery('gallery', [
                'label'	=> false
            ]);

		return $galleryComponent;

	}

}