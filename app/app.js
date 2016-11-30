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
        delete tableList[tName];

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


    $scope.clear = function() {
        jsPlumb.detachEveryConnection();
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

        $scope.tableType = ['INT', 'TEXT', 'VARCHAR','CHARACTER','DATE','TIME','TIMESTAMP', 'BINARY', 'BOOLEAN','BIGINT','DECIMAL','NUMERIC','FLOAT'];
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
            aiCKBox: false,
            referTable: undefined,
            referColumn : undefined

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
                        aiCKBox: $scope.columnInfo.aiCKBox,
                        referTable: undefined,
                        referColumn : undefined

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

        $scope.tableType = ['INT', 'TEXT', 'VARCHAR','CHARACTER','DATE','TIME','TIMESTAMP', 'BINARY', 'BOOLEAN','BIGINT','DECIMAL','NUMERIC','FLOAT'];
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
            aiCKBox: false,
            referTable: undefined,
            referColumn : undefined

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
                        aiCKBox: $scope.columnInfo.aiCKBox,
                        referTable: undefined,
                        referColumn : undefined

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
$("#jsplumb").click(function() {
    jsPlumb.setContainer("board");


    var instance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel"
            }]
        ],
        Container: "canvas"
    });

    var basicType = {
        connector: "StateMachine",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);





    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        endpointHoverStyle = {
            fill: "#216477",
            stroke: "#216477"
        },
    // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                stroke: "#7AB02C",
                fill: "transparent",
                radius: 7,
                strokeWidth: 1
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1],
                    label: "Drag",
                    cssClass: "endpointSourceLabel",
                    visible:false
                } ]
            ]
        },
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fill: "#7AB02C", radius: 7 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
            ]
        };


    jsPlumb.addEndpoint($(".columns"), {
        anchors: [1.01, 0.3, 0, 0],
        //cssClass:"redLine",
        //paintStyle:{ fill:"red",strokeWidth:1 }
    }, sourceEndpoint);



    jsPlumb.addEndpoint($(".columns"), {
        anchors: [0, 0.3, 0, 0],
    }, targetEndpoint);


    jsPlumb.bind("connection", function(info) {
        //console.log(info);
        //console.log(info.sourceId);
        //console.log(info.source.innerText);

        console.log(info.source.title)


        var sourceCol = jsPlumb.getColName(info.source.innerText);
        var targetCol = jsPlumb.getColName(info.target.innerText);

        //console.log("sourceCol: " + sourceCol + ",targetCol: "+targetCol);

        obj[info.source.title][sourceCol].referTable = info.target.title;
        obj[info.source.title][sourceCol].referColumn = targetCol;


        //foreignKey[info.sourceId][sourceCol] = {referTable: info.targetId, referColumn: targetCol};

        console.log(obj);



    });

    jsPlumb.bind("connectionDetached", function(info) {

        var sourceCol = jsPlumb.getColName(info.source.innerText);

        obj[info.source.title][sourceCol].referTable = undefined;
        obj[info.source.title][sourceCol].referColumn = undefined;


        console.log(obj);


    });


    jsPlumb.getColName = function(txt) {
        var colName = "";
        var end = txt.length;
        var i = 0;
        while(txt[i] != ":") {
            colName = colName + txt[i];
            i++;
            if(i==end) {
                break;
            }
        }

        return colName;
    }

    jsPlumb.draggable($(".tables"));



});