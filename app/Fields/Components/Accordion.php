<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Accordion {

	public static function getFields() {

		/**
         * [Component] - Accordion
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
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