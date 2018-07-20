<?php

class DPLR_Form_Controller
{
  private $doppler_service;

  function __construct($doppler_service)
  {
    $this->doppler_service = $doppler_service;
  }

  function create( $form = null ) {
    if (isset($form) && count($form) > 0) {

      DPLR_Form_Model::insert(['title' => $form['title'], 'description' => $form['description'], 'list_id' => $form['list_id']]);
      $form_id =  DPLR_Form_Model::insert_id();

      DPLR_Form_Model::setSettings($form_id, $form["settings"]);

      $field_position_counter = 1;

      $form['fields'] = isset($form['fields']) ? $form['fields'] : [];

      foreach ($form['fields'] as $key => $value) {
        $mod = ['name' => $key, 'type' => $value['type'], 'form_id' => $form_id, 'sort_order' => $field_position_counter++];
        DPLR_Field_Model::insert($mod);

        $field_id =  DPLR_Field_Model::insert_id();
        $field_settings = $value['settings'];

        DPLR_Field_Model::setSettings($field_id, $field_settings);

      }
      //TODO: create method redirect on controller
      echo "<script>location.href = 'admin.php?page=doppler_forms_submenu_forms';</script>";
    } else {
      $this->showCreateEditForm();
    }
  }

  function update($form_id, $form_to_update = NULL) {
    if (isset($form_to_update) && count($form_to_update) > 0) {

      DPLR_Form_Model::update($form_id, ['title' => $form_to_update['title'], 'description' => $form_to_update['description'], 'list_id' => $form_to_update['list_id']]);

      DPLR_Form_Model::setSettings($form_id, $form_to_update["settings"]);

      $field_position_counter = 1;

      $form_to_update['fields'] = isset($form_to_update['fields']) ? $form_to_update['fields'] : [];

      DPLR_Field_Model::deleteWhere(['form_id' => $form_id]);

      foreach ($form_to_update['fields'] as $key => $value) {
        $mod = ['name' => $key, 'type' => $value['type'], 'form_id' => $form_id, 'sort_order' => $field_position_counter++];

        DPLR_Field_Model::insert($mod);

        $field_id =  DPLR_Field_Model::insert_id();

        $field_settings = $value['settings'];

        $res = DPLR_Field_Model::setSettings($field_id, $field_settings);

      }

      echo "<script>location.href = 'admin.php?page=doppler_forms_submenu_forms';</script>";
    } else {
      $this->showCreateEditForm($form_id);
    }
  }

  function getAll() {
    $forms = DPLR_Form_Model::getAll();
		$create_form_url = admin_url( 'admin.php?page=doppler_forms_submenu_forms&action=create');
		$edit_form_url = admin_url( 'admin.php?page=doppler_forms_submenu_forms&action=edit&form_id=[FORM_ID]' );
    $delete_form_url = admin_url( 'admin.php?page=doppler_forms_submenu_forms&action=delete&form_id=[FORM_ID]' );
		include plugin_dir_path( __FILE__ ) . "../partials/forms-list.php";
  }

  function delete($id) {
    $form = DPLR_Form_Model::delete($id);
    echo "<script>location.href = 'admin.php?page=doppler_forms_submenu_forms';</script>";
  }

  private function showCreateEditForm($form_id = NULL) {
    $list_resource = $this->doppler_service->getResource('lists');
    $fields_resource = $this->doppler_service->getResource('fields');

    $dplr_lists = $list_resource->getAllLists();
    $dplr_lists = isset($dplr_lists->items) ? $dplr_lists->items : [];

    $dplr_fields = $fields_resource->getAllFields();
    $dplr_fields = isset($dplr_fields->items) ? $dplr_fields->items : [];

    usort($dplr_fields, function($a, $b) {
      if($a->predefined && $b->predefined) return 0;
      if($a->predefined) return -1;
      return 1;
    });

    if ($form_id != NULL) {
      $form = DPLR_Form_Model::get($form_id, true);
      $fields = DPLR_Field_Model::getBy(['form_id' => $form_id],['sort_order'], true);
      include plugin_dir_path( __FILE__ ) . "../partials/forms-edit.php";
    } else {
      include plugin_dir_path( __FILE__ ) . "../partials/forms-create.php";
    }
  }
}

 ?>
