<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 * @author     Your Name <email@example.com>
 */
class Doppler_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private $doppler_service;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version,  $doppler_service ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->doppler_service = $doppler_service;
		$this->form_controller = new DPLR_Form_Controller($doppler_service);
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/doppler-form-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/doppler-form-admin.js', array( 'jquery', 'jquery-ui-sortable' ), $this->version, false );
		wp_enqueue_script('field-module', plugin_dir_url( __FILE__ ) . 'js/create-edit-form-module.js', array($this->plugin_name), $this->version, false);
		wp_enqueue_script('jquery-colorpicker', plugin_dir_url( __FILE__ ) . 'js/colorpicker.js', array($this->plugin_name), $this->version, false);
		wp_enqueue_script('jquery-ui-sortable');
	}

	public function init_widget() {
		require_once(plugin_dir_path( __FILE__ ) . "../includes/class-doppler-form-widget.php");

		register_widget('Dplr_Subscription_Widget');
	}

	public function init_menu() {
		add_menu_page(
			'Doppler Forms',
			'Doppler Forms',
			'manage_options',
			'doppler_forms_menu',
			array($this, "show_template")
		);

		register_setting('dplr_plugin_options', 'dplr_settings', array($this, 'dplr_settings_validate'));
	}

	public function add_submenu() {
		$options = get_option('dplr_settings', [
			'dplr_option_apikey' => '',
			'dplr_option_useraccount' => ''
			]);

		if ($options['dplr_option_apikey'] != '' && $this->doppler_service->setCredentials(['api_key' => $options['dplr_option_apikey'], 'user_account' => $options['dplr_option_useraccount']])) {
			add_submenu_page(
				'doppler_forms_menu',
				'Forms',
				'Forms',
				'manage_options',
				'doppler_forms_submenu_forms',
				array($this, 'show_forms'));
		}
	}

	public function show_template() {
		$options = get_option('dplr_settings', [
			'dplr_option_apikey' => '',
			'dplr_option_useraccount' => ''
			]);

		$connected = false;
		$errors = false;

	  if ($options['dplr_option_apikey'] != '') {
			try{
					$connected = $this->doppler_service->setCredentials(['api_key' => $options['dplr_option_apikey'], 'user_account' => $options['dplr_option_useraccount']]);
			} catch(Doppler_Exception_Invalid_APIKey $e) {
				$errors = true;
				$errorMessages['api_key'] = __("Ouch! Enter a valid API Key.", "doppler-form");
			} catch(Doppler_Exception_Invalid_Account $e) {
				$errors = true;
				$errorMessages['user_account'] = __("Ouch! Enter a valid account.", "doppler-form");
			}
		}

		include "partials/api-connection.php";
	}

	public function show_forms() {
			$action = isset($_GET['action']) ? $_GET['action'] : 'list';

			switch ($action) {
				case 'list':
					$this->form_controller->getAll();
					break;
				case 'create':
					$this->form_controller->create($_POST);
					break;
				case 'edit':
					$this->form_controller->update($_GET['form_id'], $_POST);
					break;
				case 'delete':
					$this->form_controller->delete($_GET['form_id']);
					break;
			}
	}

	private function show_form_edit() {
		include "partials/forms-create.php";
	}
}
