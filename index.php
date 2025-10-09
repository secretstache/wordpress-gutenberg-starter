<!doctype html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="utf-8">
        <?php wp_head(); ?>
    </head>

    <body <?php body_class(); ?>>
        <a href="#main" class="absolute left-2 -top-full z-[99999] bg-black text-white font-bold px-4 py-2 rounded border-2 border-transparent no-underline transition-[top] duration-300 ease-in-out focus:top-2 focus:outline-none focus:border-white hover:focus:bg-[#1f2937]">Skip to Main Content</a>

        <?php wp_body_open(); ?>

        <div class="site flex flex-col min-h-screen *:w-full">

            <?php do_action('get_header'); ?>

            <?php echo view(app('sage.view'), app('sage.data'))->render(); ?>

            <?php do_action('get_footer'); ?>

        </div>

        <?php wp_footer(); ?>
    </body>
</html>
