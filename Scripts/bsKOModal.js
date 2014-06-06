/*
	Hint: Remember you need to set the template name before setting the modalContent for the binding to work properly!
*/
window.bsKOModal = (function (window) {
	var self = {};

	function baseModalModel(templateName, title) {
		var self = {};
		self.templateName = ko.observable(templateName);
		self.title = ko.observable(title || 'Unassigned');
		self.modalContent = ko.observable({
			body: 'Unassigned',
			onOKClick: null
		});
		return self;
	};

	self.launchModal = function () {
		$('#PageModal').modal();
	};

	self.showConfirmModal = function (title, body, onOKClick, onCancelClick) {
		var model = self.modalModel;
		self.clearModal();
		model.title(title);
		model.modalContent({
			body: body,
			onOKClick: onOKClick,
			onCancelClick: onCancelClick
		});
		model.templateName('ConfirmModalTemplate');
		self.launchModal();
	};

	self.showAlertModal = function (title, body, onOKClick) {
		var model = self.modalModel;
		self.clearModal();
		model.title(title);
		model.modalContent({
			body: body,
			onOKClick: onOKClick
		});
		model.templateName('AlertModalTemplate');

		self.launchModal();
	};

	self.clearModal = function () {
		window.bsKOModal.modalModel.templateName('');
	};

	self.modalModel = baseModalModel();

	$(document).ready(function () {
		ko.applyBindings(self.modalModel, $('#PageModal')[0])
	});

	return self;
})(window);

//rogueDeck specific extensions
(function (window) {
	var self = window.bsKOModal;
	self.showCharacterCreationModal = function (rogueGame) {
		var model = self.modalModel;
		self.clearModal();
		model.title('Create Character');
		model.modalContent(rogueGame);
		model.templateName('NewCharacterModalTemplate');
		window.bsKOModal.launchModal();
	};
})(window);