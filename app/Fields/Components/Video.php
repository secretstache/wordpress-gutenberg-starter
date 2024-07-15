<?php

namespace App\Fields\Components;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Video
{

    public static function getFields()
    {

        /**
         * [Component] - Video
         * @author Rich Staats <rich@secretstache.com>
         * @since 3.0.0
         * @todo Link to Team Snippet Code
         */
        $videoComponent = new FieldsBuilder('video');

        $videoComponent

            ->addRadio('type', [
                'label'        => 'Type',
                'layout'       => 'horizontal',
                'choices'      => [
                    'oembed'   => 'oEmbed',
                    'external' => 'External File',
                ],
            ])

            ->addOembed('video_oembed', [
                'label'        => false,
            ])
                ->conditional('type', '==', 'oembed')

            ->addImage('fallback_image', [
                'label'        => 'Fallback Image',
                'preview_size' => 'medium', // thumbnail, medium, large
            ])
                ->conditional('type', '==', 'external')

            ->addText('video_url', [
                'label'     => false,
                'prepend'   => 'Video URL'
            ])
                ->conditional('type', '==', 'external');

        return $videoComponent;
    }
}
