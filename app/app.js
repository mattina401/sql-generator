var app = angular.module("myApp", ['ngDragDrop']);

var tableList = [];
var columnList =[];
var obj = {};

app.controller('mainController', function ($scope) {

    $scope.createTable = function (tName) {

        // check table name already exists or not
        if ($.inArray(tName, tableList) > -1) {
            alert(tName + " already exists")
        } else if(tName === undefined) {
            alert("please type table name")
        }
        else {
            // add table name to tableList
            tableList.push(tName);
            //console.log(tableList);

            obj[tName] = {
                //tableName: tName
            };
        }
    }

    $scope.deleteTable = function(tName) {

        // delete table from table list
        var idx = tableList.indexOf(tName);

        if (idx > -1) {
            tableList.splice(idx, 1);
        }

        // delete table from obj
        delete obj[tName];

    }

    $scope.deleteColumn = function(tName, cName) {
        //console.log(cName);
        //console.log(obj);
        delete obj[tName][cName];

        // delete column from column list
        var idx = columnList.indexOf(tName+cName);

        if (idx > -1) {
            columnList.splice(idx, 1);
        }

        console.log(obj);

    }

    $scope.editColumn = function(tName, cName) {

    }


    $scope.displayTable = function () {
        $scope.tableList = tableList;
    }

    $scope.displayColumn = function(tName) {

        return obj[tName];
    }

    $scope.displayTable();

});


// send table Name to share modal
app.controller('sendController', ['$scope', 'dataShare',
    function ($scope, dataShare) {
        $scope.send = function (tName) {
            dataShare.sendData(tName);
        };
    }
]);

app.controller('colController', ['$scope', '$http', '$window', 'dataShare',

    function ($scope, $http, $window, dataShare) {

        $scope.tableType = ['INT', 'CHARACTER', 'VARCHAR'];
        $scope.attributes = ['BINARY', 'UNSIGNED', 'UNSIGNED ZEROFILL', 'on update CURRENT_TIMESTAMP', ''];
        $scope.indexType = ['PRIMARY', 'UNIQUE', ''];

        //variables
        $scope.tableName = undefined;

        $scope.columnInfo = {
            cName: undefined,
            typeList: undefined,
            length: undefined,
            attributesList: undefined,
            nullCKBox: false,
            indexList: undefined,
            aiCKBox: false
        }


        $scope.addColumn = function () {
            //console.log($scope.tableName);
            //console.log($scope.columnInfo.cName + " " + $scope.columnInfo.typeList + " " + $scope.columnInfo.length + " " + $scope.columnInfo.attributesList + " " + $scope.columnInfo.nullCKBox + " " + $scope.columnInfo.indexList + " " + $scope.columnInfo.aiCKBox);

            var colName = $scope.tableName + $scope.columnInfo.cName;

            // check there is duplicate column name or not
            if ($.inArray(colName, columnList) > -1) {
                alert($scope.columnInfo.cName + " already exists")
            } else {

                columnList.push(colName);
                obj[$scope.tableName][$scope.columnInfo.cName] = {
                    cName: $scope.columnInfo.cName,
                    typeList: $scope.columnInfo.typeList,
                    length: $scope.columnInfo.length,
                    attributesList: $scope.columnInfo.attributesList,
                    nullCKBox: $scope.columnInfo.nullCKBox,
                    indexList: $scope.columnInfo.indexList,
                    aiCKBox: $scope.columnInfo.aiCKBox
                };
                console.log(obj);
            }

        }


        $scope.$on('data_shared', function () {
            var tName = dataShare.getData();
            $scope.tableName = tName;
        });
    }
]);

app.factory('dataShare', function ($rootScope) {
    var service = {};
    service.data = false;
    service.sendData = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared');
    };
    service.getData = function () {
        return this.data;
    };
    return service;
});





// send table Name, column name to share modal
app.controller('sendTwoController', ['$scope', 'dataSharetwo',
    function ($scope, dataSharetwo) {
        $scope.sendtwo = function (tName, cName) {

            var two = {tName:tName, cName:cName}

            dataSharetwo.sendData(two);
        };
    }
]);

app.controller('getTwoController', ['$scope', '$http', '$window', 'dataSharetwo',

    function ($scope, $http, $window, dataSharetwo) {

        $scope.tableType = ['INT', 'CHARACTER', 'VARCHAR'];
        $scope.attributes = ['BINARY', 'UNSIGNED', 'UNSIGNED ZEROFILL', 'on update CURRENT_TIMESTAMP', ''];
        $scope.indexType = ['PRIMARY', 'UNIQUE', ''];

        //variables
        $scope.tableName = undefined;
        $scope.columnName = undefined;


        $scope.columnInfo = {
            cName: undefined,
            typeList: undefined,
            length: undefined,
            attributesList: undefined,
            nullCKBox: false,
            indexList: undefined,
            aiCKBox: false
        }


        $scope.editColumn = function () {


            // delete old column name from table list
            var idx = columnList.indexOf($scope.tableName + $scope.columnName);

            if (idx > -1) {
                columnList.splice(idx, 1);
            }


            // new column
            var colName = $scope.tableName + $scope.columnInfo.cName;

            // check there is duplicate column name or not
            if ($.inArray(colName, columnList) > -1) {
                alert($scope.columnInfo.cName + " already exists")
            } else {

                columnList.push(colName);
                obj[$scope.tableName][$scope.columnInfo.cName] = {
                    cName: $scope.columnInfo.cName,
                    typeList: $scope.columnInfo.typeList,
                    length: $scope.columnInfo.length,
                    attributesList: $scope.columnInfo.attributesList,
                    nullCKBox: $scope.columnInfo.nullCKBox,
                    indexList: $scope.columnInfo.indexList,
                    aiCKBox: $scope.columnInfo.aiCKBox
                };
                console.log(obj);

            }

        }


        $scope.$on('data_shared_two', function () {
            var tName = dataSharetwo.getData().tName;
            var cName = dataSharetwo.getData().cName;
            $scope.tableName = tName;
            $scope.columnName = cName;

            $scope.columnInfo.cName = cName;
            $scope.columnInfo.typeList = obj[tName][cName].typeList;
            $scope.columnInfo.length = obj[tName][cName].length;
            $scope.columnInfo.attributesList = obj[tName][cName].attributesList;
            $scope.columnInfo.nullCKBox = obj[tName][cName].nullCKBox;
            $scope.columnInfo.indexList = obj[tName][cName].indexList;
            $scope.columnInfo.aiCKBox = obj[tName][cName].aiCKBox;



        });
    }
]);

app.factory('dataSharetwo', function ($rootScope) {
    var service = {};
    service.data = false;
    service.sendData = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared_two');
    };
    service.getData = function () {
        return this.data;
    };
    return service;
});