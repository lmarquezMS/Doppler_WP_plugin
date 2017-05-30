(function( $ ) {
	'use strict';
console.log('hola manola');
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



			$.post(ajax_object.ajax_url, {"action": 'submit_form', "subscriber": subscriber, "list_id": list_id}, function(res) {

			});
		});
	});

})( jQuery );
