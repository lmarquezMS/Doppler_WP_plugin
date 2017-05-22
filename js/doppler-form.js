function triggerError(input) {
	var container = input.closest(".input-container");

	container.addClass('input-error');
	container.removeClass('tooltip-hide');
	container.find(".tooltip-container span").html(input.attr("data-validation-fixed"));
}

function validateEmail(emailElement){
	var email = emailElement.val();
	var container = emailElement.closest(".input-container");

	if (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
		container.removeClass('input-error');
		container.addClass('tooltip-hide');
	} else {
		container.find(".tooltip-container span").html(emailElement.attr("data-validation-email"));
		container.addClass('input-error');
		container.removeClass('tooltip-hide');
	}
}

function validateRequired(requiredElement){
	var value = requiredElement.val();

	var container = requiredElement.closest(".input-container");

	if (value) {
		container.removeClass('input-error');
		container.addClass('tooltip-hide');
	} else {
		container.find(".tooltip-container span").html(requiredElement.attr("data-validation-required"));
		container.addClass('input-error');
		container.removeClass('tooltip-hide');
	}
}

jQuery(document).ready(function(){

	jQuery("input[data-validation-fixed]").each(function() {
		triggerError(jQuery(this));
	});

	jQuery("input[data-validation-email]").focusout(function() {
			validateEmail(jQuery(this));
	});

	jQuery("input[data-validation-required]").focusout(function() {
		validateRequired(jQuery(this));
	});

	jQuery(".input-container input[type='text']").focusin(function(e) {
		jQuery(this).closest(".input-container").addClass("notempty");
		jQuery(this).addClass("notempty");

	});
	jQuery(".input-container input[type='text']").focusout(function(e) {
		if( jQuery(this).val() == ""){
			jQuery(this).closest(".input-container").removeClass("notempty");
			jQuery(this).removeClass("notempty");
		}
	});

	jQuery("#dplr_apikey_options").submit(function(event) {
		var button = jQuery(this).children('button');
		button.addClass("sending");

		validateEmail(jQuery("input[data-validation-email]"));
		validateRequired(jQuery("input[data-validation-required]"));

		var inputErrors = jQuery(this).children(".input-error");

		if(inputErrors.length > 0){
			event.preventDefault();
			button.removeClass("sending");
		}
	});

	jQuery("#dplr_apikey_options.error label input[type='text']").keyup(function(event) {
		jQuery(".error").each(function(index, el) {
			jQuery(this).removeClass('error');
		});
	});

	jQuery(".multiple-selec").each(function(){
		var elem = jQuery(this);
		var elemID = elem.attr('id');
		if(elemID != 'widget-dplr_subscription_widget-__i__-selected_lists'){
			elem.chosen({
				width: "100%",

			});
			elem.addClass('selecAdded');
		}
	});
});

jQuery(document).on('widget-updated',  function(e, elem){
		select = elem.find("form select.multiple-selec");

		select.chosen({
			width: "100%"

		});
	});

jQuery(document).on('widget-added', function(e, elem){
		select = elem.find("form select.multiple-selec");

		select.chosen({
			width: "100%",

		});
	});
