/**
 * Created by kim on 2016-11-09.
 */

var tables = [];
var tableNum = 1;
var obj = {}

$("#add-tbl").click(function () {

    // new table
    var $element = $('<div class="draggableResizable col-md-3" id="tables"> ' +
        '<input class="col-sm-6" id ="tempInput" type="text" placeholder="column name"> ' +
        '<select class="col-sm-4">' +
        '<option value="INT">INT</option>' +
        '<option value="VARCHAR">VARCHAR</option>' +
        '</select>'+
        '<input class="col-sm-12" id="tempBtn" type="button" value="+"> ' +
        '</div>');


    // add table
    obj.table_id = "table" + tableNum;
    tables.push(obj);

    tableNum = tableNum + 1;

    //append table
    $("#table").append($element);

    //make it draggable and resizable
    $element.draggable().resizable();

    $("#tempInput").attr("id", "table" + tableNum);

    return false;

});

console.log(tableNum);

$("#generate").click(function () {


    for (var i = 1; i <= tableNum; i++) {
        var id = "#table" + i;
        // new table
        var $element = $(id).val();

        console.log(id);
        console.log($element);

        $("#result").append($element);
    }


});



$("#test").click(function () {

    obj.MyGuest={id:{datatype: "int", nullType: true, primary: true}, firstname:{datatype: "string", nullType: false, primary: false}};


    console.log(obj);

    //save to cookie
    $.cookie('obj',  JSON.stringify(obj));

    //get cookie
    console.log(JSON.parse($.cookie('obj')));

    // remove cookie
    $.removeCookie('obj');

    //test
    console.log($.cookie('obj'));
});





// dialog form
$( function() {

    function createTable() {
        var tName = $('#tName').val();
        var typeList = $('#typeList option:selected').text();
        var length = $('#length').val();
        var attributes = $('#attributesList option:selected').text();
        var nullCKBox = $('#nullCKBox').is(':checked');
        var indexList = $('#indexList option:selected').text();
        var aiCKBox = $('#aiCKBox').is(':checked');

        console.log(tName + "," + typeList + "," + length + "," + attributes + "," + nullCKBox + "," + indexList + "," + aiCKBox);
    }



    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Create table" : createTable,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
        }
    });

    form = dialog.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();

    });

    $( "#create-tbl" ).button().on( "click", function() {
        dialog.dialog( "open" );
    });
} );


// dropdown list

var tableType = ['INT', 'CHARACTER', 'VARCHAR'];
var attributes = ['','BINARY', 'UNSIGNED', 'UNSIGNED ZEROFILL', 'on update CURRENT_TIMESTAMP'];
var indexType = ['','PRIMARY', 'UNIQUE'];

//table type list
$.each(tableType, function(key, value) {
    $('#typeList').append($("<option></option>").attr("value", key).text(value));
});

// attributes type
$.each(attributes, function(key, value) {
    $('#attributesList').append($("<option></option>").attr("value", key).text(value));
});

// index type
$.each(indexType, function(key, value) {
    $('#indexList').append($("<option></option>").attr("value", key).text(value));
});
