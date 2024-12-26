<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Form {

	public static function getFields() {

		/**
         * [Component] - Form
         */
        $formComponent = new FieldsBuilder('form');

        $formComponent
        
            ->addField('form', 'forms', [
                'label'     => 'Choose Form',
            ]);

		return $formComponent;

	}

}