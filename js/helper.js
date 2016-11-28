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




    jsPlumb.draggable($(".tables"));
    //jsPlumb.draggable($(".columns"));


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

