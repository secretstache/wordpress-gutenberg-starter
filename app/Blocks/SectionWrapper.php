<?php

namespace App\Blocks;

use InvalidArgumentException;
use stdClass;

class SectionWrapper extends Block
{
    private const BG_TYPE_COLOR = 'color';
    private const BG_TYPE_IMAGE = 'image';
    private const BG_TYPE_VIDEO = 'video';
    private const BG_TYPE_ANIMATION = 'animation';

    protected function prepareData($attributes, $content): array
    {
        $background_type = $attributes['backgroundType'] ?? false;

        $background_color = $attributes['backgroundColor'] ?? false;
        $background_image = $attributes['backgroundImage'] ?? false;
        $focal_point      = $attributes['focalPoint'] ?? ['x' => 0.5, 'y' => 0.5];
        $background_video = $attributes['backgroundVideo'] ?? false;

        $is_include_overlay = $attributes['isIncludeOverlay'] ?? false;
        $overlay_color = $attributes['overlayColor'] ?? false;

        $is_background_type_color = $background_type === self::BG_TYPE_COLOR;
        $is_background_type_image = $background_type === self::BG_TYPE_IMAGE;
        $is_background_type_video = $background_type === self::BG_TYPE_VIDEO;

        $has_selected_background_image = $is_background_type_image && $background_image['url'];
        $has_selected_background_video = $is_background_type_video && $background_video['url'];
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

        $background_media = $this->getBackgroundMedia($attributes);

        $full_viewport_height_class = $this->getFullViewportClass($attributes);
        $spacing_classes = $this->getSpacingClasses($attributes, 'md:', 'max-md:', 'ssm-');

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
            'focal_point'            => $focal_point,
            'content'                => $content
        ];
    }

    private function getSpacingClasses(
        array $attributes,
        string $desktopPrefix = 'md:',
        string $mobilePrefix = '',
        string $valuePrefix = ''
    ): string {
        $SKIP = -1;

        $spacing = $attributes['spacing'] ?? null;

        $buildClass = static function ($prefix, $property, $valuePrefixLocal, $value) use ($SKIP) {
            if ($value === $SKIP) {
                return null;
            }
            return sprintf('%s%s-%s%s', (string)$prefix, $property, (string)$valuePrefixLocal, (string)$value);
        };

        $candidates = [
            $buildClass($desktopPrefix, 'mt', $valuePrefix, $spacing['desktop']['margin']['top'] ?? null),
            $buildClass($desktopPrefix, 'mb', $valuePrefix, $spacing['desktop']['margin']['bottom'] ?? null),
            $buildClass($desktopPrefix, 'pt', $valuePrefix, $spacing['desktop']['padding']['top'] ?? null),
            $buildClass($desktopPrefix, 'pb', $valuePrefix, $spacing['desktop']['padding']['bottom'] ?? null),
            $buildClass($mobilePrefix, 'mt', $valuePrefix, $spacing['mobile']['margin']['top'] ?? null),
            $buildClass($mobilePrefix, 'mb', $valuePrefix, $spacing['mobile']['margin']['bottom'] ?? null),
            $buildClass($mobilePrefix, 'pt', $valuePrefix, $spacing['mobile']['padding']['top'] ?? null),
            $buildClass($mobilePrefix, 'pb', $valuePrefix, $spacing['mobile']['padding']['bottom'] ?? null),
        ];

        $filtered = array_values(array_filter($candidates, static function ($v) {
            return is_string($v) && strlen($v) > 0;
        }));

        return implode(' ', $filtered);
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
        $backgroundMediaType = $this->getBackgroundType($attributes);

        switch ($backgroundMediaType) {
            case self::BG_TYPE_IMAGE:
                $backgroundMedia = $this->getBackgroundImage($attributes);
                break;

            case self::BG_TYPE_VIDEO:
                $backgroundMedia = $this->getBackgroundVideo($attributes);
                break;

            case self::BG_TYPE_ANIMATION:
                $backgroundMedia = $this->getBackgroundAnimation($attributes);
                break;
        }

        $backgroundMedia['type'] = $backgroundMediaType;

        return $backgroundMedia;
    }

    private function getBackgroundType(array $attributes): ?string {
        $type = $attributes['backgroundType'] ?? null;
        $validTypes = [
            self::BG_TYPE_IMAGE,
            self::BG_TYPE_COLOR,
            self::BG_TYPE_VIDEO,
            self::BG_TYPE_ANIMATION
        ];

        if ($type && !in_array($type, $validTypes, true)) {
            throw new InvalidArgumentException("Invalid bg type: {$type}");
        }

        return $type;
    }

    private function getBackgroundImage(array $attributes): array {
        $media = $attributes['backgroundImage'] ?? [];

        return [
            'url' => $media['url'] ?? null,
            'alt' => $media['alt'] ?? 'background image'
        ];
    }

    private function getBackgroundVideo(array $attributes): array {
        $media = $attributes['backgroundVideo'] ?? [];

        return [
            'url' => $media['url'] ?? null
        ];
    }

    private function getBackgroundAnimation(array $attributes): array {
        $media = $attributes['backgroundAnimation'] ?? [];

        return [
            'url' => $media['url'] ?? null,
            'is_looped' => $attributes['isAnimationLooped'] ?? false
        ];
    }
}
