(function ()
{

    'use strict';

    function navBar()
    {
        return {
            restrict: 'ACE',
            controller: 'NavBar',
            controllerAs: 'nav',
            templateUrl: 'directive/navBar.tpl.html'
        };
    }

    angular.module('helloAngular').directive('navBar', [ navBar ]);


})();