/**
 * Created by davidsantamaria on 17/2/17.
 */

var app = angular.module('dashboardLayout', ['ngRoute']);

app.component('dashboardLayout',{
    templateUrl: '_layout/dashboard.layout.template.html',
    controller : [ function LaoyoutController (){
        var self = this;
        this.itemClass = "list-group-item active";
        this.stackedClass = "list-group-item";
        this.setCssClass = function(item){
            if (item === 'monitor') {
                this.itemClass = "list-group-item active";
                this.stackedClass = "list-group-item";
                $('#liNodes').removeAttr("style");
                $('#liServices').removeClass('active');
                $('#liNodes').addClass('active');
            }
            else {
                this.itemClass = "list-group-item";
                this.stackedClass = "list-group-item active";
                $('#liNodes').css('display','none');
                $('#liServices').addClass('active');

            }
        };
    }]
});
