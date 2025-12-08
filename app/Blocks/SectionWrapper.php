<?php

namespace App\Blocks;

use App\View\Composers\SSM;

class SectionWrapper extends Block
{
    private const BG_TYPE_COLOR = 'color';
    private const BG_TYPE_IMAGE = 'image';
    private const BG_TYPE_VIDEO = 'video';
    private const BG_TYPE_ANIMATION = 'animation';

    protected function prepareData($attributes, $content): array
    {
        $background_type = $attributes['backgroundType'] ?? false;

        $background_color               = $attributes['backgroundColor'] ?? false;
        $background_image               = $attributes['backgroundImage'] ?? false;
        $focal_point                    = $attributes['focalPoint'] ?? ['x' => 0.5, 'y' => 0.5];
        $background_video_source        = $attributes['backgroundVideoSource'] ?? 'file';
        $external_background_video_url  = $attributes['externalBackgroundVideoUrl'] ?? '';
        $background_video               = $attributes['backgroundVideo'] ?? [];

        $is_include_overlay = $attributes['isIncludeOverlay'] ?? false;
        $overlay_color = $attributes['overlayColor'] ?? false;

        $is_background_type_color = $background_type === self::BG_TYPE_COLOR;
        $is_background_type_image = $background_type === self::BG_TYPE_IMAGE;
        $is_background_type_video = $background_type === self::BG_TYPE_VIDEO;

        $has_selected_background_image = $is_background_type_image && $background_image['url'];

        $is_background_video_source_file = $background_video_source === 'file';
        $is_background_video_source_external = $background_video_source === 'external';

        $has_selected_background_video = $is_background_type_video && (
            ($is_background_video_source_file && !empty($background_video['url'])) || ($is_background_video_source_external && !empty($external_background_video_url))
        );

        $has_selected_background_color = $is_background_type_color && !empty($background_color['slug']);

        $has_selected_background_media = $has_selected_background_image || $has_selected_background_video;
        $has_selected_background = $has_selected_background_color || $has_selected_background_media;

        $has_selected_overlay_color = $is_include_overlay && !empty($overlay_color['slug']);

        $background_color_class = $has_selected_background_color
            ? $this->getColorClass($attributes, 'backgroundColor', 'bg-', '')
            : '';

        $overlay_color_class = $has_selected_overlay_color
            ? 'has-overlay ' . $this->getColorClass($attributes, 'overlayColor', 'has-', '-overlay')
            : '';

        if ($has_selected_background) {
            $background_media = [
                'type'      => $background_type,
                'image'     => $has_selected_background_image ? [
                    'url'   => $background_image['url'],
                    'alt'   => $background_image['alt'] ?? 'Background Image',
                    'focal_point' => $focal_point,
                ] : null,
                'video'     => $has_selected_background_video ? [
                    'url'   => $is_background_video_source_file ? $background_video['url'] : $external_background_video_url,
                ] : null,
            ];
        }

        $full_viewport_height_class = $this->getFullViewportClass($attributes);
        $spacing_classes = SSM::getSpacingClasses($attributes, 'md:', 'max-md:', 'ssm-');

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', array_filter([
                $has_selected_background ? 'has-background' : null,
                $full_viewport_height_class,
                $spacing_classes,
                SSM::getBackgroundToneClass($background_type, $background_color['slug'])
            ])),
            'id' => $attributes['anchor'] ?? '',
        ]);

        return [
            'wrapper_attributes'     => $wrapper_attributes,
            'background_color_class' => $background_color_class,
            'overlay_color_class'    => $overlay_color_class,
            'background_media'       => $background_media ?? false,
            'content'                => $content
        ];
    }

    private function getColorClass(array $attributes, string $colorKey, string $prefix = 'has-', string $suffix = '-background-color', ): string {
        return !empty($attributes[$colorKey]['slug'])
            ? $prefix . $attributes[$colorKey]['slug'] . $suffix
            : '';
    }

    private function getFullViewportClass(array $attributes): string {
        return ($attributes['isFullViewportHeight'] ?? false) ? 'h-screen' : '';
    }
}
