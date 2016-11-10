var app = angular.module("UserAuthTutorial", ["ui.router"]);

app.config(function ($stateProvider) {
    $stateProvider
        .state("login", {
            url: "/",
            controller: "LoginController",
            templateUrl: "login.html"
        })
        .state("application", {
            url: "/app",
            controller: "MainController",
            templateUrl: "application.html"
        })

});