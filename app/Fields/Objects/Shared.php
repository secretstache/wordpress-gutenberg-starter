<?php

namespace App\Fields\Objects;

use StoutLogic\AcfBuilder\FieldsBuilder;
use App\Fields\Components\Header;

class Shared {

	public function __construct() {

		/**
		 * Inline Styles
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$inlineStyles = new FieldsBuilder('inline_styles', [
			'menu_order' =>	5
		]);

		$inlineStyles

			->addField('page_inline_styles', 'acfe_code_editor', [
				'label'	   => 'CSS Editor',
				'mode' 	   => 'css',
				'rows'     => 2,
				'max_rows' => 4
			])

			->setLocation('post_type', '==', 'page')
				->or('post_type', '==', 'post');

		// Register Inline Styles
		add_action('acf/init', function() use ($inlineStyles) {
			acf_add_local_field_group($inlineStyles->build());
		});

		/**
		 * Inline Scripts
		 * @author Rich Staats <rich@secretstache.com>
		 * @since 3.0.0
		 * @todo Link to Team Snippet Code
		 */
		$inlineScripts = new FieldsBuilder('inline_scripts', [
			'menu_order' =>	10
		]);

		$inlineScripts

			->addField('page_inline_scripts', 'acfe_code_editor', [
				'label'		=> 'JS Editor',
				'mode' 		=> 'javascript',
				'rows'		=> 4,
				'max_rows' 	=> 4
			])

			->setLocation('post_type', '==', 'page')
				->or('post_type', '==', 'post');

		// Register Inline Scripts
		add_action('acf/init', function() use ($inlineScripts) {
			acf_add_local_field_group($inlineScripts->build());
		});

	}

}