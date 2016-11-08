(function ()
{

    'use strict';

    function AppCtrl($scope, $state, Authenticator, CurrentUser)
    {
        var ctrl = this;

        //TAB1
        //Nie potrzebuje niczego do szczescia ;)


        //TAB2
        // ng-click
        this.ngClick = function ()
        {
            alert('Wlaśnie się pojawiłem. Żyje :3');

            //Oczywiście pamiętaj, że to jest zwykła funkcja, która może przyjmować parametry i inne cuda.
            //Ogranicza Cię własna wyobraźnia co możesz z tym zrobić :)
        };

        // ng-init
        this.ngInit1 = '<div ng-init=\"test = \'Witaj, świecie.\'\"></div>';
        this.ngInit2 = '{{test}}';

        //ng-hide i ng-show
        this.hideMe = function ()
        {
            ctrl.isHidden = !ctrl.isHidden;
        };

        this.hideMeString = 'hideMe = function ()\n' +
                '{\n' +
                '    ctrl.isHidden = !ctrl.isHidden;\n' +
                '};';

        // ng-if
        this.ngIf = '<div ng-if="hidden">\n' +
                '   Kliknij przycisk powyzej, aby przełączyć widoczność.\n' +
                '</div>'

        // ng-repeat
        this.contacts = [
            {
                name: 'Jan Kowalski',
                phone: '123 321 123',
                email: 'jankowalski@gmail.com'
            },
            {
                name: 'Marek Nowak',
                phone: '987 789 987',
                email: 'marek.nowak@buziaczek.pl'
            }
        ];

        this.contactsString = "[\n" +
                "   {\n" +
                "       name: 'Jan Kowalski',\n" +
                "       phone: '123 321 123',\n" +
                "       email: 'jankowalski@gmail.com'\n" +
                "   },\n" +
                "   {\n" +
                "       name: 'Marek Nowak',\n" +
                "       phone: '987 789 987',\n" +
                "       email: 'marek.nowak@buziaczek.pl'\n" +
                "   }\n" +
                "]";

        this.showContact = '<ul>\n' +
                '   <li ng-repeat="contact in contacts"></li>\n' +
                '</ul>';

        //TAB3
        ctrl.checkName = function (name)
        {
            var letters = /^[a-zA-Z]+$/; // ojoj a co to za stwor przebrzydly ?! bez obaw to tzw. REGEX potrzebny do sprawdzania lancucha znakow czy znajduja sie w nim tylko literki ;)
            if (name.match(letters)) {
                ctrl.info = 'Podales prawidlowe imie';
                ctrl.success = true;
                ctrl.fail = false;
            } else {
                ctrl.info = 'Ojoj coś jest nie tak ;<';
                ctrl.success = false;
                ctrl.fail = true;
            }
        };

        ctrl.checkPhone = function (phone)
        {
            var numbers = /^[0-9]{9}/;
            if(phone.match(numbers)) {
                ctrl.info = 'Podales prawidlowy numer telefonu';
                ctrl.success = true;
                ctrl.fail = false;
            } else {
                ctrl.info = 'Ojoj coś jest nie tak ;<';
                ctrl.success = false;
                ctrl.fail = true;
            }
        };

        ctrl.checkEmail = function (email)
        {
            var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            //nie oszustwo! po prostu wiedza jak używać google

            if (email.match(regex)) {
                ctrl.info = 'Podales prawidlowy mail';
                ctrl.success = true;
                ctrl.fail = false;
            } else {
                ctrl.info = 'Ojoj coś jest nie tak ;<';
                ctrl.success = false;
                ctrl.fail = true;
            }
        };

        // A to tylko śmieci do obsługi tego toturialu ;)
        this.content = function ()
        {
            ctrl.show = !ctrl.show;
        };

        this.mainShow = true;

        this.showContent = function (num)
        {
            switch (num) {
                case 1:
                    ctrl.showFirst = !ctrl.showFirst;
                    ctrl.showSnd = false;
                    ctrl.showThr = false;
                    ctrl.showInformation = false;
                    ctrl.mainShow = false;
                    break;
                case 2:
                    ctrl.showFirst = false;
                    ctrl.showThr = false;
                    ctrl.showSnd = !ctrl.showSnd;
                    ctrl.showInformation = false;
                    ctrl.mainShow = false;
                    break;
                case 3:
                    ctrl.showFirst = false;
                    ctrl.showSnd = false;
                    ctrl.showThr = !ctrl.showThr;
                    ctrl.showInformation = true;
                        ctrl.mainShow = false;
                    break;
                default:
                    console.log('Ciekawe jak to zrobileś ;D hmm?');
            }
        };
    }

    angular.module('helloAngular').controller('AppCtrl', ['$scope', AppCtrl]);

})();
