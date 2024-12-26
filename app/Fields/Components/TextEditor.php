<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class TextEditor {

	public static function getFields( $type, $label ) {

		/**
         * [Component] - Text Editor
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