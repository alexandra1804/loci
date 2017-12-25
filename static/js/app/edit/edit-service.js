/**
 * My Organization service.
 */

(function () {
	'use strict';

	var injections = [
		'localization',
		'organizationsTreeService',
		'permissions'
	];

	function factory(localization, organizationsTreeService, permissions) {

		var service = {},
			tabs = [
				{
					template: 'organizationCenter/organizations/users/users.html',
					name: 'orgCenterUsers',
					title: localization.get('rc.app.organization.title.users')
				},
				{
					template: 'organizationCenter/organizations/costCenters/costCenters.html',
					name: 'orgCenterCostCenters',
					title: localization.get('rc.app.organization.title.costCenters')
				},
				{
					template: 'organizationCenter/organizations/businessRules/businessRules.html',
					name: 'orgCenterBusinessRules',
					title: localization.get('rc.app.organization.title.businessRules')
				}
			];

		service.getTabs = function () {
			return angular.copy(tabs).filter(function (tab) {
				return permissions.canAccess(tab.name);
			});

		};

		service.canEditBusinessRulesData = function () {
			var validCommands = permissions.getCommandsFor('BUSINESS_RULES', 'BUSINESS_RULES');
			return validCommands.indexOf('EDIT') !== -1 && validCommands.indexOf('DELETE') !== -1;
		};

		service.selectedOrg = {};
		service.options = {
			viewAll: false,
			fullOrgsList: []
		};

		//service.editRights = permissions.checkRoleForBusinessRules(service.selectedOrg);

		service.organizationsDefaults = {
			search: organizationsTreeService.organizationsSearch
		};
		service.loadTree = organizationsTreeService.loadTree;

		service.resizeGridHeight = function (gridApi) {
			var element = angular.element(gridApi.grid.element[0]),
				parent,
				footer = angular.element('.item-info-footer'),
				offset, result;

			// not apply recalculation for hidden grid
			if (!element.is(':visible')) {
				return;
			}

			switch (true) {
				case (element.parents('.modal-dialog').length > 0):
					parent = element.parents('.modal-dialog').last();
					break;
				case (angular.element('.rc-page').length > 0):
					parent = element.parents('.rc-page').last();
					break;
				case (angular.element('.cm-container').length > 0):
					parent = element.parents('.cm-container').last();
					break;
				default:
					parent = element.parents('.tab-pane').last();
					break;
			}

			// reset parent height
			element.outerHeight(0);

			offset = element.offset().top - parent.offset().top;
			result = ((parent.outerHeight() || 0) - offset) - (footer.outerHeight() || 0);

			element.outerHeight(result);
		};

		return service;
	}

	factory.$inject = injections;

	angular.module('organization').factory('organizationsService', factory);
})();