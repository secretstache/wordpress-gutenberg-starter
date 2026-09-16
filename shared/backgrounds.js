import backgrounds from './backgrounds.json';

/**
 * Palette slugs dark enough to need the light-on-dark treatment — they get
 * `bg-dark`, everything else gets `bg-light`.
 *
 * The list itself lives in backgrounds.json, not here, because PHP reads the
 * same file (App\View\Composers\SSM::getDarkBackgroundColors). Editing the
 * array in one runtime only is what let the editor and the front end disagree
 * about which sections were dark. Add slugs to the JSON.
 */
export const darkBackground = backgrounds.darkBackground;
