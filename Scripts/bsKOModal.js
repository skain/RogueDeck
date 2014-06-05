window.bsKOModal = (function (window) {
	var self = {};

	function baseModalModel(templateName, title) {
		var self = {};
		self.templateName = ko.observable(templateName || 'AlertModalTemplate');
		self.title = ko.observable(title || 'Unassigned');
		self.modalContent = ko.observable({
			body: 'Unassigned',
			onOKClick: null
		});
		return self;
	};

	self.showConfirmModal = function (title, body, onOKClick, onCancelClick) {
		var model = self.modalModel;
		model.title(title);
		model.modalContent({
			body: body,
			onOKClick: onOKClick,
			onCancelClick: onCancelClick
		});
		model.templateName('ConfirmModalTemplate');
		$('#PageModal').modal();
	};

	self.showAlertModal = function (title, body, onOKClick) {
		var model = self.modalModel;
		model.title(title);
		model.modalContent({
			body: body,
			onOKClick: onOKClick
		});
		model.templateName('AlertModalTemplate');

		$('#PageModal').modal();
	}

	self.modalModel = baseModalModel();

	$(document).ready(function () {
		ko.applyBindings(self.modalModel, $('#PageModal')[0])
	});

	return self;
})(window);