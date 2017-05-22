
jQuery(document).ready(function(){
	jQuery('form.dplr_wdg_form').on('submit', function(event){
		event.preventDefault();
		var form = jQuery(this);
		var args = {
			action: 'add_subscribers',
			args: {
				list_ids: form.find('input[name=lists]').val(),
				email: form.find('input[name=email]').val()
			}
		}

		jQuery.ajax({
			url: 'wp-admin/admin-ajax.php',
			type: 'POST',
			data: args,
		})
		.done(function(res) {
			form.fadeOut('slow', function() {
				form.siblings("div.thanksMessage").fadeIn('slow', function() {
					setTimeout(function(){
						form.siblings("div.thanksMessage").fadeOut('slow', function(){
							jQuery("form.dplr_wdg_form input[type='email']").val("")
							form.fadeIn('slow');
						});
					}, 3000);
				});
			});
		})
		.fail(function(res) {
			console.log(res);
		})
		.always(function(res) {

		});
		
	});	
}); 