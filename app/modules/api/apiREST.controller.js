(function(){

    'use strict';

    function APIrestController()
    {
        var ctrl = this;

        this.title = 'API REST';
    }

    angular.module('helloAngular').controller('APIrestController',[ APIrestController ]);

})();