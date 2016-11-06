(function ()
{
    'use strict';

    function HelloAngularDAO($resource)
    {
        var api = $resource('https://ngtests.herokuapp.com/api/:a/:b/', null, {
            getProducts: { isArray: true, method: 'GET', params: {a: 'products'}},
            // getProductById: { isArray: true, method: 'GET', params: {a: 'product'}}
        });

        return {
            getProducts: function()
            {
                return api.getProducts().$promise;
            }
            // getProductById: function (id)
            // {
            //     return api.getProductById({b: id}).$promise;
            // }
        };
    }

    angular.module('helloAngular').factory('HelloAngularDAO', ['$resource', HelloAngularDAO]);
})();