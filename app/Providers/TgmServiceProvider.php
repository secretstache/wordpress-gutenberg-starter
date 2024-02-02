<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Roots\Acorn\Sage\SageServiceProvider;

class TgmServiceProvider extends SageServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        require_once get_theme_file_path() . '/libs/TGM/class-tgm-plugin-activation.php';

        add_action('tgmpa_register', [$this, 'register_required_plugins']);
    }

    /**
     * Registers the required plugins for the theme.
     */
    public function register_required_plugins()
    {

        // Read your JSON file and convert it to an array
        $json = File::get(get_theme_file_path() . '/config/json/required-plugins.json');
        $plugins = json_decode($json, true);

        // Call the TGM function to register your required plugins.
        tgmpa($plugins);
    }
}
