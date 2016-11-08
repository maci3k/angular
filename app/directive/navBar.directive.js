(function ()
{

    'use strict';

    function navBar()
    {
        return {
            restrict: 'ACE',
            scope: {
                task: '='
            },
            controller: 'NavBar',
            controllerAs: 'nav',
            templateUrl: 'directive/navBar.tpl.html'
        };
    }

    angular.module('helloAngular').directive('navBar', [ navBar ]);


})();