<?php echo "<script>console.log(".json_encode($form).");</script>"; ?>

<div class="dplr">
  <form class="" method="post">
    <input type="hidden" name="create" value="true">
      <div class="grid">
        <div class="col-4-5 panel nopd">
          <div class="panel-header">
            <h2>Datos de formulario</h2>
          </div>
          <div class="panel-body">
            <div class="dplr_input_section">
              <label for="title">Form name</label>
              <input type="text" name="title" placeholder="" value="<?php echo $form->title; ?>" />
            </div>
            <div class="dplr_input_section">
              <label for="description">Form description</label>
              <textarea name="description" rows="8" cols="80"><?php echo $form->description; ?></textarea>
            </div>
            <div class="dplr_input_section">
              <label for="list_id">Doppler List</label>
              <select class="" name="list_id">
                <?php for ($i=0; $i < count($dplr_lists); $i++) { ?>
                  <option <?php echo $form->list_id == $dplr_lists[$i]->listId ? 'selected="selected"' : ''; ?> value="<?php echo $dplr_lists[$i]->listId; ?>">
                    <?php echo $dplr_lists[$i]->name; ?>
                  </option>
                <?php } ?>
                </select>
            </div>
          </div>
        </div>
      </div>
      <div class="grid">
          <div class="col-4-5 panel nopd">
            <div class="panel-header">
              <h2>Campos del formulario</h2>
            </div>
            <div class="panel-body grid">
              <div class="col-1-2 dplr_input_section">
                <label for="list_id">Select the fields to include</label>
                <select id="fieldList" class="" name="">
                  <option value="" >select the fields</option>
                </select>
              </div>
              <div class="col-1-2">
                <ul class="sortable accordion" id="formFields">

                </ul></div>
            </div>
          </div>
      </div>
      <div class="grid">
        <div class="col-4-5 panel nopd">
          <div class="panel-header">
            <h2>Form settings</h2>
          </div>
          <div class="panel-body grid">
            <div class="dplr_input_section">
              <label for="submit_text">Tex to show on button</label>
              <input type="text" name="settings[button_text]" value="<?php echo $form->settings["button_text"] ?>" />
            </div>
            <div class="dplr_input_section">
              <label for="settings[button_position]">Select a position</label>
              <?php $button_position = $form->settings["button_position"]; ?>
              <select class="" name="settings[button_position]">
                <option <?php if($button_position == 'left') echo 'selected="selected"';?> value="left">Left</option>
                <option <?php if($button_position == 'center') echo 'selected="selected"';?> value="center">Center</option>
                <option <?php if($button_position == 'right') echo 'selected="selected"';?> value="right">Right</option>
                <option <?php if($button_position == 'fill') echo 'selected="selected"';?> value="fill">Fill</option>
              </select>
            </div>
            <div class="dplr_input_section">
              <label for="settings[button_color]">Color Background</label>
              <input class="color-selector" type="text" name="settings[button_color]" value="<?php echo $form->settings["button_color"]; ?>">
            </div>
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="col-4-5 panel nopd">
          <div class="panel-header">
            <h2>Edit confirmation options</h2>
          </div>
          <div class="panel-body grid">
            <div class="dplr_input_section">
              <label for="submit_text">Select an action</label>
              <input type="radio" name="settings[form_confirmation_action]" value="message" /> Show Message<br>
              <input type="radio" name="settings[form_confirmation_action]" value="redirect" /> Redirect to Url<br>
            </div>
            <div id="url_container" class="dplr_input_section">
              <label for="settings[form_confirmation_value]">Url to redirect</label>
              <input type="text" name="settings[form_confirmation_value]">
            </div>
            <div id="message_container" class="dplr_input_section">
              <label for="settings[form_confirmation_value]">Message to show</label>
              <textarea name="settings[form_confirmation_value]"></textarea>
            </div>
          </div>
        </div>
      </div>
    <input type="submit" value="ok">
  </form>
</div>
<script type="text/javascript">
var all_fields = <?php echo json_encode($dplr_fields); ?>;
var form_fields = <?php echo json_encode($fields); ?>;
var fieldsView = new FormFieldsView(all_fields, form_fields, jQuery("#fieldList"), jQuery("#formFields"));
jQuery(".color-selector").colorpicker({color: "<?php echo $form->settings["button_color"]; ?>"});
var actions_view = new FormActionsView("message", jQuery("input[name='settings[form_confirmation_action]']"), jQuery("#url_container"), jQuery("#message_container"));
</script>
