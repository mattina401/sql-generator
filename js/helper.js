
var foreignKey = {};


$("#jsplumb").click(function() {
    jsPlumb.setContainer("board");

    var common = {
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"]
    };

    jsPlumb.addEndpoint($(".columns"), {
        anchors: "Right"
    }, common);

    jsPlumb.addEndpoint($(".columns"), {
        anchor: "Left"
    }, common);


    jsPlumb.bind("connection", function(info) {
        console.log(info);
        console.log(info.sourceId);
        console.log(info.source.innerText);



        var sourceCol = jsPlumb.getColName(info.source.innerText);
        var targetCol = jsPlumb.getColName(info.target.innerText);

        console.log("sourceCol: " + sourceCol + ",targetCol: "+targetCol);

        foreignKey[info.sourceId][sourceCol] = {};

        //foreignKey[info.sourceId][sourceCol] = {referTable: info.targetId, referColumn: targetCol};

        console.log(foreignKey);


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

    jsPlumb.bind("connectionDetached", function(info) {
        console.log(info);

    });

    jsPlumb.draggable($(".tables"));


});


// cookie
$("#test").click(function () {

    obj.MyGuest = {
        id: {datatype: "int", nullType: true, primary: true},
        firstname: {datatype: "string", nullType: false, primary: false}
    };


    console.log(obj);

    console.log(obj.MyGuest.firstname.datatype);

    //save to cookie
    $.cookie('obj', JSON.stringify(obj));

    //get cookie
    console.log(JSON.parse($.cookie('obj')));

    // remove cookie
    $.removeCookie('obj');

    //test
    console.log($.cookie('obj'));
});

