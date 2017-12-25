/**
 * My Organization controller.
 */
(function () {
	'use strict';

	var injections = [
		'$scope',
		'localization',
		'organizationsService',
		'TreeCtrl',
		'security'
	];

	function organizationsController($scope,
	                                 localization,
	                                 organizationsService,
	                                 TreeCtrl,
	                                 security) {

		$scope.options = organizationsService.options;

		$scope.selectedOrg = organizationsService.selectedOrg;

		$scope.tabs = organizationsService.getTabs();
		$scope.activeTab = $scope.tabs[0];
		$scope.changeActiveTab = function (newTab) {
			$scope.activeTab = newTab;
		};


		$scope.organizations = new TreeCtrl({
			initialised: false,

			treeControl: {
				selectionModel: {
					selectCondition: function (row) {
						return row.branch.selectable;
					}
				}
			},
			columns: [],

			rest: organizationsService.loadTree,

			search: organizationsService.organizationsDefaults.search,

			ownFilter: true,
			ownSearch: true,

			expandOn: {
				field: 'name',
				displayName: localization.get('js.rc.orgInfo.name')
			}
		});

		$scope.$watch('organizations.treeControl.selected', function (newSelected, oldSelected) {
			if (oldSelected === newSelected) {
				return;
			}

			if (oldSelected) { //dont reset viewAll for the first time
				$scope.options.viewAll = $scope.organizations.treeControl.selectionModel.viewAllCheck = false;
			}

			if (angular.isArray(newSelected)) {
				if (newSelected.length) {
					$scope.selectedOrg.Id = newSelected[0];
				}
			} else {
				$scope.selectedOrg.Id = newSelected;
			}

			$scope.selectedOrg.entity = $scope.organizations.getSelectedEntities()[0];
			$scope.selectedOrg.isLocked = security.isLockedForMe($scope.selectedOrg.entity.lockedByAgentId);

			$scope.$broadcast('organizations.selectedOrg', $scope.selectedOrg);
		});

		$scope.$watch('organizations.select.value', function (newValue, oldValue) {
			if (newValue === oldValue) {
				return;
			}
			$scope.organizations.reload($scope.organizations.ownFilter);
		});

		$scope.organizations.reload().then(function () {
			var selectableIds = $scope.organizations.getAllSelectableIds();
			$scope.organizations.treeControl.setSelected(selectableIds[0]);
		});
	}

	organizationsController.$inject = injections;

	angular.module('organization').controller('organizationsController', organizationsController);

})();