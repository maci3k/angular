(function ()
{
    'use strict';

    function HelloAngularDAO($resource)
    {
        var api = $resource('https://ngtests.herokuapp.com/api/:a/:b/', null, {
            getProducts: { isArray: true, method: 'GET', params: {a: 'products'}},
        });

        return {
            getProducts: function()
            {
                return api.getProducts().$promise;
            }
        };
    }

    angular.module('helloAngular').factory('HelloAngularDAO', ['$resource', HelloAngularDAO]);
})();