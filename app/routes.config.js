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

                $stateProvider.state('task', {
                    url: '/task',
                    templateUrl: 'modules/task/task.tpl.html',
                    controller: 'TaskController as task'
                });

                $urlRouterProvider.otherwise('/api');
            }]);

        }

)();