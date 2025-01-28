<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Accordion {

	public static function getFields() {

		/**
         * [Component] - Accordion
         */
        $accordionComponent = new FieldsBuilder('accordion');

        $accordionComponent

            ->addRepeater('accordion', [
                'label'         => false,
                'layout'		=> 'block',
                'min'			=> 1,
                'collapsed'		=> 'title',
                'button_label'	=> 'Add Item',
            ])

                ->addText('title', [
                    'label'     => 'Title',
                ])

                ->addWysiwyg('description', [
                    'label'         => 'Description',
                    'toolbar'       => 'basic',
                    'media_upload' 	=> 0
                ])

            ->endRepeater();

		return $accordionComponent;

	}

}