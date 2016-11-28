var app = angular.module("myApp", ['ngDragDrop']);

var tableList = {};
var columnList = [];
var obj = {};

app.controller('mainController', function ($scope) {

    $scope.createTable = function (tName) {

        // check table name already exists or not
        if ($.inArray(tName, tableList) > -1) {
            alert(tName + " already exists")
        } else if (tName === undefined) {
            alert("please type table name")
        }
        else {
            // add table name to tableList
            //var table = {tName: {primaryKey: [], uniqueKey: []}}
            //tableList.push(table);
            //console.log(tableList);

            tableList[tName] = {tName: tName, primaryKey: [], uniqueKey: []}


            obj[tName] = {
                //tableName: tName
            };
        }
    }

    $scope.deleteTable = function (tName) {

        // delete table from table list
        var idx = tableList.indexOf(tName);

        if (idx > -1) {
            tableList.splice(idx, 1);
        }

        // delete table from obj
        delete obj[tName];

    }

    $scope.deleteColumn = function (tName, cName) {
        //console.log(cName);
        //console.log(obj);
        delete obj[tName][cName];

        // delete column from column list
        var idx = columnList.indexOf(tName + cName);

        if (idx > -1) {
            columnList.splice(idx, 1);
        }

        console.log(obj);

    }

    $scope.getColumns = function (tName) {
        return obj[tName];
    }


    $scope.displayTable = function () {
        $scope.tableList = tableList;
    }

    $scope.displayColumn = function (tName) {
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
            dataLength: undefined,
            attributesList: undefined,
            nullCKBox: "NOT NULL",
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


                if ($scope.columnInfo.nullCKBox == "NULL" && $scope.columnInfo.indexList == "PRIMARY") {
                    alert("Primary key cannot be NULL")
                } else {

                    if ($scope.columnInfo.indexList == "PRIMARY") {
                        tableList[$scope.tableName].primaryKey.push($scope.columnInfo.cName);
                    } else if ($scope.columnInfo.indexList == "UNIQUE") {
                        tableList[$scope.tableName].uniqueKey.push($scope.columnInfo.cName);
                    }

                    columnList.push(colName);

                    obj[$scope.tableName][$scope.columnInfo.cName] = {
                        cName: $scope.columnInfo.cName,
                        typeList: $scope.columnInfo.typeList,
                        dataLength: $scope.columnInfo.dataLength,
                        attributesList: $scope.columnInfo.attributesList,
                        nullCKBox: $scope.columnInfo.nullCKBox,
                        indexList: $scope.columnInfo.indexList,
                        aiCKBox: $scope.columnInfo.aiCKBox
                    };

                    console.log(obj);
                    console.log(tableList);

                    angular.element('.modal').modal('hide');

                }
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

            var two = {tName: tName, cName: cName}

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
            dataLength: undefined,
            attributesList: undefined,
            nullCKBox: "NOT NULL",
            indexList: undefined,
            aiCKBox: false
        }


        $scope.editColumn = function () {



            // if user change column name
            if ($scope.columnName != $scope.columnInfo.cName) {

                // delete old column in obj
                delete  obj[$scope.tableName][$scope.columnName];
            }

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

                // primary key cannot be null
                if ($scope.columnInfo.nullCKBox == "NULL" && $scope.columnInfo.indexList == "PRIMARY") {
                    alert("Primary key cannot be NULL")
                } else {

                    if ($scope.columnInfo.indexList == "PRIMARY") {

                        var idx = tableList[$scope.tableName].primaryKey.indexOf($scope.columnInfo.cName);

                        if (idx < 0) {
                            tableList[$scope.tableName].primaryKey.push($scope.columnInfo.cName);
                        }

                    } else if ($scope.columnInfo.indexList == "UNIQUE") {

                        var idx = tableList[$scope.tableName].uniqueKey.indexOf($scope.columnInfo.cName);

                        if (idx < 0) {
                            tableList[$scope.tableName].uniqueKey.push($scope.columnInfo.cName);
                        }
                    } else if ($scope.columnInfo.indexList == "" || $scope.columnInfo.indexList == undefined) {
                        var idx_primary = tableList[$scope.tableName].primaryKey.indexOf($scope.columnInfo.cName);
                        var idx_unique = tableList[$scope.tableName].uniqueKey.indexOf($scope.columnInfo.cName);

                        if (idx_primary > -1) {
                            tableList[$scope.tableName].primaryKey.splice(idx_primary, 1);

                        } else if (idx_unique > -1) {
                            tableList[$scope.tableName].uniqueKey.splice(idx_unique, 1);

                        }
                    }


                    columnList.push(colName);
                    obj[$scope.tableName][$scope.columnInfo.cName] = {
                        cName: $scope.columnInfo.cName,
                        typeList: $scope.columnInfo.typeList,
                        dataLength: $scope.columnInfo.dataLength,
                        attributesList: $scope.columnInfo.attributesList,
                        nullCKBox: $scope.columnInfo.nullCKBox,
                        indexList: $scope.columnInfo.indexList,
                        aiCKBox: $scope.columnInfo.aiCKBox
                    };
                    console.log(obj);
                    angular.element('.modal').modal('hide');
                }
            }

        }

        $scope.$on('data_shared_two', function () {
            var tName = dataSharetwo.getData().tName;
            var cName = dataSharetwo.getData().cName;
            $scope.tableName = tName;
            $scope.columnName = cName;

            $scope.columnInfo.cName = cName;
            $scope.columnInfo.typeList = obj[tName][cName].typeList;
            $scope.columnInfo.dataLength = obj[tName][cName].dataLength;
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





/*jsPlumb*/
/*
jsPlumb.ready(function () {
    jsPlumb.setContainer("diagramContainer");

    var common = {
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"]
    };

    jsPlumb.addEndpoint("item_left", {
        anchors: "Right"
    }, common);

    jsPlumb.addEndpoint("item_right", {
        anchor: "Left"
    }, common);




    jsPlumb.bind("connection", function (info) {
        console.log(info);
        //console.log(info.sourceId);
        //console.log(info.source);
    });


    jsPlumb.bind("connectionDetached", function (info) {
        console.log(info);

    });


    jsPlumb.draggable("item_left");
    jsPlumb.draggable("item_right");


});
*/