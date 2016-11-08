(function ()
{
    'use strict';

    function HelloAngularDAO($resource)
    {
        var api = $resource('https://ngtests.herokuapp.com/api/:a/:b/', null, {
            getProducts: { isArray: true, method: 'GET', params: {a: 'products'}},
            getProduct: { isArray: true, method: 'GET', params: {a: 'product'}}
        });

        return {
            getProducts: function()
            {
                return api.getProducts().$promise;
            },
            getProduct: function(id) {
                return api.getProduct({b: id}).$promise;
            }
        };
    }

    angular.module('helloAngular').factory('HelloAngularDAO', ['$resource', HelloAngularDAO]);
})();