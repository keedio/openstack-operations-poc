/**
 * Created by davidsantamaria on 17/2/17.
 */

var app = angular.module('dashboardLayout', ['ngRoute']);

app.component('dashboardLayout',{
    templateUrl: '_layout/dashboard.layout.template.html',
    controller : [ '$location', function LaoyoutController ($location){

        this.menuClass =  function(page) {
            var current = $location.path().substring(1);

            return page === current ? "list-group-item  active" : "list-group-item ";
        };
    }]
});
