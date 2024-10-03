<?php
/**
 * Plugin.
 * @package reactplug
 * @wordpress-plugin
 * Plugin Name:     [Shortcode] Gallerie de réalisations
 * Description:     Plugin pour afficher une gallerie de réalisations grâce à un shortcode.
 * Author:          Lucas Bodet
 * Author URL:      https://github.com/lucasbodev
 * Version:         1.0
 */

define("REACT_APP_ID", "realisations");

add_shortcode(constant("REACT_APP_ID"), 'displayReactApp');

add_action('wp_enqueue_scripts', 'enq_react');

function displayReactApp()
{
    ob_start();
    ?>
    <div id="<?php echo constant("REACT_APP_ID"); ?>" class="wp-plugin-wrapper"></div>
    <script>
        window.reactAppId = '<?php echo constant("REACT_APP_ID"); ?>';
    </script>
    <?php
    $output = ob_get_contents();
    ob_get_clean();
    return $output;
}

function enq_react()
{
    $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_register_script(
        'display-react',
        plugin_dir_url(__FILE__) . '/build/index.js',
        $asset['dependencies'],
        $asset['version'],
        array(
            'in_footer' => true,
        )
    );

    wp_enqueue_script('display-react');
}