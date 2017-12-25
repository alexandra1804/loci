'use strict';

angular.module('myApp', [
    'ngRoute',
    'firebase'
]).constant('FirebaseUrl', 'https://myapps-ee62d.firebaseio.com/')
    // .service('firebaseRef', ['FirebaseUrl', Firebase])
    .directive('markdown', linkConverter)
    .controller('listCtrl', listController)
    .controller('newCtrl', newController)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'listCtrl',
            templateUrl: 'views/appslist.html',
            callback: console.log('view h b loaded')
        })
                    .when('/new', {
            controller: 'newCtrl',
            templateUrl: 'views/newapp.html',
            callback: console.log('view h b loaded')
        });

    }]);

function listController($scope, firebaseRef, $firebaseArray) {
    $scope.load = function() {
       $('.button-collapse').sideNav({
           closeOnClick: true
       });
       $('.parallax').parallax();
    };
    
    $scope.load();
    
    $scope.list = $firebaseArray(firebaseRef);
    $scope.list.$loaded().then(function() {
        console.log($scope.list);
        console.log("The number of projects in DB is " + $scope.list.length);
    }.bind($scope));
    
    $scope.search = {};
    $scope.userInput = {};
    
    $scope.applySearch = function() {
        for(name in $scope.userInput) {
            $scope.search[name] = $scope.userInput[name];
        }
    };
};

function newController($scope, firebaseRef, $firebaseArray, $window) {
    $scope.list = $firebaseArray(firebaseRef);
    $scope.nameInput = [];
    $scope.descrInput = [];
        $scope.addProject = function() {
            $scope.newListItem = firebaseRef.push();
            $scope.newListItem.set({
                name: $scope.nameInput,
                description: $scope.descrInput
            });
            $window.location.href = "index.html";
            console.log("A new project has been added");
            console.log( $scope.nameInput);
            console.log( $scope.descrInput);
        };
};

function linkConverter() {
    var converter = new Showdown.converter();
    return {
      scope: {
        markdown: '@'
      },
      link: function(scope, element, attrs) {
        scope.$watch('markdown', function() {
          var content = converter.makeHtml(attrs.markdown);
          element.html(content);
        });
      }
    }
};


/*'use strict';
angular
    .module('myApp', ['ngRoute'])
    .controller('listCtrl', MyController)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/', {
            controller: 'listCtrl',
            templateUrl: 'views/appslist.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

function MyController ($scope) {
    $scope.init = function ( ) {
        $scope.rootRef = new Firebase('https://myapps-angfire.firebaseio.com/');
        $scope.list = [];
        $scope.rootRef.on('child_added', function (snapshot) {
            $scope.message = snapshot.val();
            //console.log($scope.message);
            $scope.list.push($scope.message);
            return $scope.list;
        });   
    };
$scope.init();
};
*/
/*
$scope.init = function ( ) {
    $scope.rootRef = new Firebase('https://myapps-angfire.firebaseio.com/');
    $scope.rootRef.on('child_added', function (snapshot) {
        $scope.
        $scope.message = snapshot.val();
        console.log($scope.message);
    });   
};
$scope.init();
*/

/*var lblCurrentMessage = document.getElementById('lblCurrentMessage'),
    txtNewMessage = document.getElementById('txtNewMessage'),
    btUpdateMessage = document.getElementById('btUpdateMessage'),
    rootRef = new Firebase('https://myapps-angfire.firebaseio.com/');
    currentMessageRef = rootRef.child('currentMessage');


btUpdateMessage.addEventListener('click', function() {
    currentMessageRef.set(txtNewMessage.value);
    txtNewMessage.value = '';
});

currentMessageRef.on('value', function(snapshot) {
    lblCurrentMessage.innerText = snapshot.val();
});
*/

'use strict';

angular.module('organization', [
	'security',
	'services',
	'ui.grid',
	'ui.grid.resizeColumns',
	'ui.grid.autoResize',
	'ui.grid.selection',
	'ui.grid.infiniteScroll'
]).config(['routeFilterProvider', 'authorizationProvider', function (routeFilterProvider, authorizationProvider) {

	routeFilterProvider.registerFilter('/organizationCenter:path?', {
		resolve: {
			user: authorizationProvider.requireUser
		},
		reloadOnSearch: false,
		onRouteError: {
			redirectTo: '/'
		}
	});

	routeFilterProvider.when('/organizationCenter', {
		templateUrl: 'organizationCenter/organizations/organizations.html',
		resolve: {
			canNav: ['permissions', function (permissions) {
				return permissions.canNavigate('organizations');
			}]
		}
	});

}]);
