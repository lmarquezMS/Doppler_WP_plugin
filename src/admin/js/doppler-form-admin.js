(function( $ ) {

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

function validateRequired(requiredElement) {
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

$(document).ready(function(){

	$("input[data-validation-fixed]").each(function() {
		triggerError($(this));
	});

	$("input[data-validation-email]").focusout(function() {
			validateEmail($(this));
	});

	$("input[data-validation-required]").focusout(function() {
		validateRequired($(this));
	});

	$(".input-container input[type='text']").focusin(function(e) {
		$(this).closest(".input-container").addClass("notempty");
		$(this).addClass("notempty");

	});
	$(".input-container input[type='text']").focusout(function(e) {
		if( $(this).val() == ""){
			$(this).closest(".input-container").removeClass("notempty");
			$(this).removeClass("notempty");
		}
	});

	$("#dplr_apikey_options").submit(function(event) {
		var button = $(this).children('button');
		button.addClass("sending");

		validateEmail($("input[data-validation-email]"));
		validateRequired($("input[data-validation-required]"));

		var inputErrors = $(this).children(".input-error");

		if(inputErrors.length > 0){
			event.preventDefault();
			button.removeClass("sending");
		}
	});

	$("#dplr_apikey_options.error label input[type='text']").keyup(function(event) {
		$(".error").each(function(index, el) {
			$(this).removeClass('error');
		});
	});

	$(".multiple-selec").each(function(){
		var elem = $(this);
		var elemID = elem.attr('id');
		if(elemID != 'widget-dplr_subscription_widget-__i__-selected_lists'){
			elem.chosen({
				width: "100%",

			});
			elem.addClass('selecAdded');
		}
	});

	$( ".sortable" ).sortable({
		placeholder: "ui-state-mark"
	});
	$( ".sortable" ).disableSelection();


	var fields = {
		container: $("ul#formFields"),

		items: [],
		addItem: function(item) {
			var domElement = $(item.renderItem());
			var _this = this;
			this.items.push(item);
			domElement.find(".icon-close").on("click", function(){
				$(this).parent().remove();
			});
			this.container.append(domElement);
		},
		removeItem: function(element) {

		}
	};

	$("body").on('click', "li i", function(e) {
		$(this).closest('li').toggleClass('active');
	});
});

$(document).on('widget-updated',  function(e, elem){
		select = elem.find("form select.multiple-selec");

		select.chosen({
			width: "100%"

		});
	});

$(document).on('widget-added', function(e, elem){
		select = elem.find("form select.multiple-selec");

		select.chosen({
			width: "100%",
		});
	});


})( jQuery );
