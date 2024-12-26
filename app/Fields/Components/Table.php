<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Table {

	public static function getFields() {

		/**
         * [Component] - Table
         */
        $tableComponent = new FieldsBuilder('table');

        $tableComponent

            ->addField('table', 'table', [
                'label'     => false
            ]);

		return $tableComponent;

	}

}