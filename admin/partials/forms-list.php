<h1>Forms List</h3>
<div class="dplr">
  <div class="panel">
    <div class="">
      <table class="fixed">
        <thead>
          <tr>
            <th class="cb"><input type="checkbox" name="" value=""></th>
            <th class="col-id">Id</th>
            <th class="col-title">Title</th>
            <th class="col-description">Description</th>
            <th class="col-listid">List Id</th>
          </tr>
        </thead>
        <tbody>
          <?php for ($i=0; $i <count($forms) ; $i++) {
            $form = $forms[$i];?>
          <tr>
            <td><input type="checkbox" name="" value=""></td>
            <td><?php echo $form->id; ?></td>
            <td>
              <a href="<?php echo str_replace('[FORM_ID]', $form->id , $edit_form_url); ?>" class="bold"> <?php echo $form->title; ?></a>
              <div class="column-actions">
                <a href="<?php echo str_replace('[FORM_ID]', $form->id , $delete_form_url); ?>">Delete</a>
              </div>
            </td>
            <td><?php echo $form->description; ?></td>
            <td><?php echo $form->list_id; ?></td>
          </tr>
          <?php } ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<a href="<?php echo $create_form_url; ?>">Crear Formulario</a>
