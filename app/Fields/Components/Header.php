<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Header {

	public static function getFields() {

		/**
		 * [Component] - Header
		 */
		$headerComponent = new FieldsBuilder('header');

		$headerComponent

			->addText('headline', [
				'label' => 'Headline'
			])
			
			->addText('subheadline', [
				'label' => 'Subheadline'
			]);

		return $headerComponent;

	}

}