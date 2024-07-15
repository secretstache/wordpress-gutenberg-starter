<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Table {

	public static function getFields() {

		/**
         * [Component] - Table
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
         */
        $tableComponent = new FieldsBuilder('table');

        $tableComponent

            ->addField('table', 'table', [
                'label'     => false
            ]);

		return $tableComponent;

	}

}