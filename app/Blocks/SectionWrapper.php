<?php

namespace App\Blocks;

use InvalidArgumentException;
use stdClass;

class SectionWrapper extends Block
{
    private const MEDIA_TYPE_IMAGE = 'image';
    private const MEDIA_TYPE_VIDEO = 'video';
    private const MEDIA_TYPE_ANIMATION = 'animation';

    protected function prepareData($attributes, $content): array
    {
        $background_color = $attributes['backgroundColor'] ?? false;

        $is_include_background_media = $attributes['isIncludeBackgroundMedia'] ?? false;
        $background_media_type = $attributes['backgroundMediaType'] ?? false;
        $media = $attributes['media'] ?? false;

        $is_include_overlay = $attributes['isIncludeOverlay'] ?? false;
        $overlay_color = $attributes['overlayColor'] ?? false;

        $is_background_type_image = $background_media_type === self::MEDIA_TYPE_IMAGE;
        $is_background_type_video = $background_media_type === self::MEDIA_TYPE_VIDEO;

        $has_selected_background_image = $is_background_type_image && $media['url'];
        $has_selected_background_video = $is_background_type_video && $media['url'];
        $has_selected_background_color = !empty($background_color['slug']);

        $has_selected_background_media = $has_selected_background_image || $has_selected_background_video;
        $has_selected_background = $has_selected_background_color || $has_selected_background_media;

        $has_selected_overlay_color = $is_include_overlay && !empty($overlay_color['slug']);

        $background_color_class = $has_selected_background_color
            ? $this->getColorClass($attributes, 'backgroundColor')
            : '';

        $overlay_color_class = $has_selected_overlay_color
            ? 'has-overlay ' . $this->getColorClass($attributes, 'overlayColor', 'has-', '-overlay')
            : '';

        $background_media = $is_include_background_media
            ? $this->getBackgroundMedia($attributes)
            : null;

        $full_viewport_height_class = $this->getFullViewportClass($attributes);
        $spacing_classes = $this->getSpacingClasses($attributes);

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', array_filter([
                'has-background' => $has_selected_background,
                $full_viewport_height_class,
                $spacing_classes,
            ])),
            'id' => $attributes['anchor'] ?? '',
        ]);

        return [
            'wrapper_attributes'     => $wrapper_attributes,
            'background_color_class' => $background_color_class,
            'overlay_color_class'    => $overlay_color_class,
            'background_media'       => $background_media,
            'content'                => $content
        ];
    }

    private function getSpacingClasses(array $attributes, string $desktopPrefix = 'spacing-', string $mobilePrefix = 'mobile-spacing-'): string {
        $classes = [];

        if (!isset($attributes['spacing']) || !is_array($attributes['spacing'])) {
            return '';
        }

        $types = ['margin', 'padding'];
        $directions = ['top', 'bottom'];
        $prefixes = ['desktop' => $desktopPrefix, 'mobile' => $mobilePrefix];

        foreach ($prefixes as $device => $prefix) {
            foreach ($types as $type) {
                foreach ($directions as $direction) {
                    $value = $attributes['spacing'][$device][$type][$direction] ?? null;
                    if ($value !== null && $value !== -1) {
                        $classes[] = $prefix . $type[0] . $direction[0] . '-' . $value;
                    }
                }
            }
        }

        return implode(' ', $classes);
    }

    private function getColorClass(array $attributes, string $colorKey, string $prefix = 'has-', string $suffix = '-background-color', ): string {
        return !empty($attributes[$colorKey]['slug'])
            ? $prefix . $attributes[$colorKey]['slug'] . $suffix
            : '';
    }

    private function getFullViewportClass(array $attributes): string {
        return ($attributes['isFullViewportHeight'] ?? false) ? 'h-screen' : '';
    }

    private function getBackgroundMedia(array $attributes): null|array {
        $backgroundMedia = [];
        $backgroundMediaType = $this->getBackgroundMediaType($attributes);

        switch ($backgroundMediaType) {
            case self::MEDIA_TYPE_IMAGE:
                $backgroundMedia = $this->getBackgroundImage($attributes);
                break;

            case self::MEDIA_TYPE_VIDEO:
                $backgroundMedia = $this->getBackgroundVideo($attributes);
                break;

            case self::MEDIA_TYPE_ANIMATION:
                $backgroundMedia = $this->getBackgroundAnimation($attributes);
                break;
        }

        $backgroundMedia['type'] = $backgroundMediaType;

        return $backgroundMedia;
    }

    private function getBackgroundMediaType(array $attributes): ?string {
        $type = $attributes['backgroundMediaType'] ?? null;
        $validTypes = [
            self::MEDIA_TYPE_IMAGE,
            self::MEDIA_TYPE_VIDEO,
            self::MEDIA_TYPE_ANIMATION
        ];

        if ($type && !in_array($type, $validTypes, true)) {
            throw new InvalidArgumentException("Invalid media type: {$type}");
        }

        return $type;
    }

    private function getBackgroundImage(array $attributes): array {
        $media = $attributes['media'] ?? [];

        return [
            'url' => $media['url'] ?? null,
            'alt' => $media['alt'] ?? 'background image'
        ];
    }

    private function getBackgroundVideo(array $attributes): array {
        $media = $attributes['media'] ?? [];

        return [
            'url' => $media['url'] ?? null
        ];
    }

    private function getBackgroundAnimation(array $attributes): array {
        $media = $attributes['media'] ?? [];

        return [
            'url' => $media['url'] ?? null,
            'is_looped' => $attributes['isAnimationLooped'] ?? false
        ];
    }
}
