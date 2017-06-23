var FormFieldsView,
	FormActionsView;

(function( $ ) {

	FormFieldsView = (function() {
		function FormFieldsView(unselectedFields, selectedFields, unselectedFieldsContainer, selectedFieldsContainer) {
			var _this = this;
			this.unselectedFieldsContainer = unselectedFieldsContainer;
			this.selectedFieldsContainer = selectedFieldsContainer;
			this.unselectedFields = unselectedFields;
			this.selectedFields = [];

			this.getIndexOfCustom = function(elem, index, arrayOfElements) {
				if (arrayOfElements.length < index) return -1;

				if (arrayOfElements[index].name == elem.name) return index;

				return  this.getIndexOfCustom(elem, ++index, arrayOfElements);
			};

			for (var index in unselectedFields) {
				var unselectedField = unselectedFields[index];
				this.addUnselectElement(unselectedField);
				if ((selectedFields == null || selectedFields.length == 0) && unselectedField.name == "EMAIL") {
					unselectedField
					selectedFields = [unselectedField];
				}
			}

			for (var index in selectedFields) {
				this.selectElement(selectedFields[index]);
			}

			this.unselectedFieldsContainer.on('change', function() {
				_this.selectElement({name: $(this).val()});
			});

		}

		FormFieldsView.prototype.addUnselectElement = function(element) {
			this.unselectedFieldsContainer.append('<option data-field-id="'+element.id+'" data-field-type="'+element.type+'" value="'+element.name+'">'+element.name+'</option>');
		};

		FormFieldsView.prototype.selectElement = function(fieldToSelect) {
			var _this = this;
			var selectedIndex = this.getIndexOfCustom(fieldToSelect, 0, this.unselectedFields);
			var unselectedField = this.unselectedFields[selectedIndex];

			if (fieldToSelect.settings != undefined)
				unselectedField.settings = fieldToSelect.settings;

			var selectedOption = this.unselectedFieldsContainer.find("option[value='"+unselectedField.name+"']");

			this.selectedFields.push(unselectedField);
			this.unselectedFields.splice(selectedIndex, 1);

			selectedOption.addClass("selected");

			selectedOption.removeAttr("selected");

			//Add Selected Item view
			var newSelectedFieldDOMElement = $(this.renderSelectedField(unselectedField));

			newSelectedFieldDOMElement.find(".icon-close").click(function() {
				var selectedFieldContainer = $(this).closest('li');
				_this.unselectItem(selectedFieldContainer);
			});

			this.selectedFieldsContainer.append(newSelectedFieldDOMElement);
		};

		FormFieldsView.prototype.renderSelectedField = function(field) {
			field.settings = field.settings != undefined ? field.settings : {
				required: false,
				description: "",
				placeholder: ""
			};

			var html = "<li data-field-name='"+ field.name +"'>";
			html += !field.readonly ? "<div class='icon-close'></div>" : "";
			html += "<a href='#'>"+ field.name + "</a><span class='type'> ("+field.type+")</span><i></i>";
			html += ' <input type="hidden" name="fields['+field.name+'][type]" value="'+field.type+'">'
			html += ' <div class="accordion-content field-settings">';

			var checkedRequired = field.settings.required || field.readonly ? "checked" : "";
			var readonly = field.readonly ? "disabled='disabled'" : "";
			var label = field.settings.label != undefined ? field.settings.label : field.name;
			html += field.readonly ? '		<input type="hidden" name="fields['+field.name+'][settings][required]" value="required">' : '';
			html += '		<div class="dplr_input_section horizontal">';
			html += '			<label for="fields['+field.name+'][settings][required]">Required</label>';
			html += '   	<input '+readonly+' class="setting-required" type="checkbox" '+checkedRequired+' name="fields['+field.name+'][settings][required]" value="required"><br>';
			html += '		</div>';
			html += '		<div class="dplr_input_section horizontal">';
			html += '			<label for="fields['+field.name+'][settings][label]">Label to show</label>';
			html += '   	<input class="setting-required" type="text" name="fields['+field.name+'][settings][label]" value="'+label+'"><br>';
			html += '		</div>';
			html += '		<div class="dplr_input_section horizontal">';
			html += '			<label for="fields['+field.name+'][settings][description]">Description</label>';
			html += '   	<textarea name="fields['+field.name+'][settings][description]">'+field.settings.description+'</textarea><br>';
			html += '		</div>';
			if ($.inArray(field.type, ['boolean', 'gender', 'date']) == -1) {
				html += '		<div class="dplr_input_section horizontal">';
				html += '			<label for="fields['+field.name+'][settings][placeholder]">Placeholder</label>';
				html += '   	<input type="text" name="fields['+field.name+'][settings][placeholder]" value="'+field.settings.placeholder+'">';
				html += '		</div>';
			}
			if (field.type === "string") {
				html += '		<div class="dplr_input_section horizontal">';
				html += '			<label for="fields['+field.name+'][settings][text_lines]">Text type</label>';
			html += '				<select name="fields['+field.name+'][settings][text_lines]">'
				html += field.settings.text_lines == "single" ? '				<option selected="selected" value="single">One single line</option>' : '				<option value="single">One single line</option>';
				html += field.settings.text_lines == "multi" ? '   		<option selected="selected" value="multi">Multiple lines</option>' : '   		<option value="multi">Multiple lines</option>';
				html += '			</select>';
				html += '		</div>';
			}
			html += ' </div>';
			html += "</li>";
			return html;
		};

		FormFieldsView.prototype.unselectItem = function (item) {
			var fieldName = item.attr("data-field-name");

			var selectedIndex = this.getIndexOfCustom({name: fieldName}, 0, this.selectedFields);
			var fieldToUnselect = this.selectedFields[selectedIndex];

			var selectedOption = this.unselectedFieldsContainer.find("option[value='"+fieldName+"']");

			item.remove();

			this.unselectedFields.push(fieldToUnselect);
			this.selectedFields.splice(selectedIndex, 1);

			selectedOption.removeClass("selected");
		}

		return FormFieldsView;

	})();

	FormActionsView = (function() {
		function FormActionsView(actionSelected, selectorContainer, urlContainer, messageContainer) {
			this.containerSelected = urlContainer;
			this.selectorContainer = selectorContainer || NULL;
			this.urlContainer = urlContainer || NULL;
			this.messageContainer = messageContainer || NULL;
			var _this = this;

			this.selectorContainer.change(function(e) {
				var selected = $(this).val();
				_this.changeAction(selected);
			});

			selectorContainer.closest("form").submit(function() {
				var hidden_container = $(this).find(".filter-input");

				var hidden_inputs = hidden_container.find("input, textarea");

				hidden_inputs.each(function() {
					$(this).attr('name', '');
				});
			})
		}

		FormActionsView.prototype.changeAction = function(action) {
			switch (action) {
				case 'redirect':
					this.urlContainer.removeClass("filter-input");
					this.messageContainer.addClass("filter-input");
					break;
				case 'message':
					this.messageContainer.removeClass("filter-input");
					this.urlContainer.addClass("filter-input");
					break; 
				default:
					break;
			}
		}

		return FormActionsView;
	})();

})(jQuery);