(function( $ ) {
	'use strict';

	$(document).ready(function() {

		$("form.dplr_form input[type='text'].date").each(function() {
			var dateElement = $(this);

			var elementName = dateElement.attr('name');

			dateElement.datepicker({
				'dateFormat': 'dd/mm/yy',
				'altFormat': 'yy-mm-dd',
				'altField': 'input[name="fields-'+elementName+'"]'
			});
		});

		$('.dplr_form').submit(function(ev) {
			ev.preventDefault();

			

			var subscriber = {},
				list_id = $("input[name='list_id']").val();

			var form = $(this);

			subscriber.email = $("input[name='EMAIL']").val();
			subscriber.fields = [];

			var fields = $("input[name|='fields'], select[name|='fields']");

			fields.each(function(index) {
				var input = $(fields[index]);

				if (input.attr('type') == 'radio' && !input.is(':checked')) return;

				var name = input.attr('name');
				name = name.split('-');
				name = name.slice(1);
				name = !Array.isArray(name) ? name : name.join('-');

				var field = {};
				field['name'] = name;
				field['value'] = input.val();

				subscriber.fields.push(field);
			});

			form.fadeOut("800",function() {console.log("termino");});

			$.post(ajax_object.ajax_url, {"action": 'submit_form', "subscriber": subscriber, "list_id": list_id}, function(res) {
				var action_type = form.attr('data-action-type'),
					action_value = form.attr('data-action-value');

				performPostAction(action_type, action_value, form);
			});
		});
	});

	function performPostAction(action_type, action_value, form) {
		switch (action_type) {
			case 'redirect':
				action_value = action_value.startsWith("http") ? action_value : 'http://' + action_value;
				window.location = action_value;
				break;
			case 'message':
				var post_action_message = $("<p class='post_action_message'>" + action_value + "</p>").hide();
				form.after(post_action_message);
				post_action_message.fadeIn("fast");
				setTimeout(function() {
					form.fadeIn("slow");
					post_action_message.fadeOut("slow", function() {
						$(this).remove();
					});
				}, 2000);
				break;				
			default:
				break;
		}
	}

})( jQuery );
