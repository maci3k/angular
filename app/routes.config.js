(function ()
        {
            'use strict';

            angular.module('helloAngular').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
            {
                $stateProvider.state('api', {
                    url: '/api',
                    templateUrl: 'modules/api/api.tpl.html',
                    controller: 'APIrestController as api'
                });

                $urlRouterProvider.otherwise('/api');
            }]);

        }

)();