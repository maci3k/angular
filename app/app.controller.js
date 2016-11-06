(function(){

    'use strict';

    function AppCtrl($scope, $state, Authenticator, CurrentUser)
    {
        var ctrl = this;

        this.content = function (){
            ctrl.show = !ctrl.show;
            console.log(ctrl.show);
        }
    }

    angular.module('helloAngular').controller('AppCtrl',[ '$scope', AppCtrl ]);

})();