<?php

namespace App\Providers;

use Illuminate\Support\Str;
use Roots\Acorn\Sage\SageServiceProvider;

class ThemeServiceProvider extends SageServiceProvider
{
	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register()
	{
		parent::register();
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{

		parent::boot();

		$this->loadBlocks();

        add_action('init', [$this, 'registerBlockPatternCategories']);
        add_action('init', [$this, 'registerBlockPatterns']);
	}

	/**
	 * Load blocks.
	 *
	 * @return void
	 */
	protected function loadBlocks(): void
	{
		$blockPath = get_theme_file_path('/app/Blocks');
		$blockFiles = \File::allFiles($blockPath);

		foreach ($blockFiles as $blockFile) {
			$filename = $blockFile->getFilenameWithoutExtension();

			if ($filename === 'Block') {
				continue;
			}

			$class = $this->filenameToClassname($blockFile->getPathname());

			if (class_exists($class) && is_subclass_of($class, 'App\Blocks\Block')) {
				$folderName = \Str::kebab(class_basename($class));
				new $class($folderName);
			}
		}
	}

	/**
	 * Convert file path to class name.
	 *
	 * @param string $filepath
	 * @return string
	 */
	protected function filenameToClassname(string $filepath): string
	{
		$filename = pathinfo($filepath, PATHINFO_FILENAME);
		return "\\App\\Blocks\\{$filename}";
	}

    public function registerBlockPatterns()
    {
        if (!function_exists('register_block_pattern')) {
            return;
        }

        $patternConfig = $this->app['config']->get('patterns.block_pattern', []);

        foreach ($patternConfig as $name => $options) {
            $view = 'block-patterns.' . Str::after($name, '/');

            if (view()->exists($view)) {
                $options['content'] = view($view)->render();
            }

            // Register the block pattern
            register_block_pattern($name, $options);
        }
    }

    public function registerBlockPatternCategories()
    {
        $categories = $this->app['config']->get('patterns.block_pattern_category', []);

        foreach ($categories as $slug => $category) {
            if (function_exists('register_block_pattern_category')) {
                register_block_pattern_category(
                    $slug,
                    ['label' => $category['label']]
                );
            }
        }
    }
}
