<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Header {

	public static function getFields() {

		/**
		 * [Component] - Header
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
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