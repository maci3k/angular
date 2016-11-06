(function(){

    'use strict';

    function AppCtrl(HelloAngularDAO)
    {
        var ctrl = this;

        this.content = function (){
            ctrl.show = !ctrl.show;
        };
    }

    angular.module('helloAngular').controller('AppCtrl',[ AppCtrl ]);

})();