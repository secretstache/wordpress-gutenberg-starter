<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class TextEditor {

	public static function getFields( $type, $label ) {

		/**
         * [Component] - Text Editor
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
         */
        $textEditorComponent = new FieldsBuilder('text-editor');

        $toolbar = ( $type && $type == 'simple' ) ? 'basic' : 'full';
        $media_upload = ( $type && $type == 'simple' ) ? 0 : 1;
        
        $textEditorComponent

            ->addWysiwyg('text_editor', [
                'label'         => $label,
                'toolbar'       => $toolbar,
                'media_upload' 	=> $media_upload
            ]);

		return $textEditorComponent;

	}

}