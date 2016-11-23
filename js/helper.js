/**
 * Created by kim on 2016-11-09.
 */

var tables = [];
var tableNum = 0;
var obj = {}

/*
 $(document).on('click', "input.newBtn", function () {
 console.log(this.id);
 });
 */
$(document).on('click', "input.deleteBtn", function () {

    // get num from deleteBtn's id
    var num = this.id.replace(/^\D+/g, '');

    // get table id
    var table = 'table' + num;

    // delete table
    $('#' + table).remove();

    // delete table from table list
    var idx = tables.indexOf(table);

    if (idx > -1) {
        tables.splice(idx, 1);
    }

    // delete table from obj
    delete obj[table];
    console.log(obj);

});

// delete column
$(document).on('click', "input.deleteColumn", function () {

    // get num from deleteBtn's id
    var num = this.id.replace(/^\D+/g, '');
    var cName = this.id.replace(/[0-9]/g, '');

    // get table id
    var table = 'table' + num

    // delete column
    $('#colDiv' + cName + num).remove();


    // delete column from obj
    delete obj[table][cName];
    console.log(obj);

});


// add table
$("#add-tbl").click(function () {

    var tableName = $('#tableName').val();
    var $element = $('<div class="draggableResizable tables" id="tempTable"> ' +
        '<p id="tempP">' + tableName + '</p> ' +
        '<input class="col-sm-12 newBtn" id="tempNEW" type="button" value="NEW"> ' +
        '<input class="col-sm-12 deleteBtn" id="tempDLT" type="button" value="DELETE"> ' +
        '</div>');

    // check table name already exist or not
    if ($.inArray(tableName, tables) > -1) {
        alert(tableName + " already exists")
    } else {

        tables.push("table" + tableNum);

        obj["table" + tableNum] = {
            tableName: tableName,
            newBtn: "newBtn" + tableNum,
            deleteBtn: "deleteBtn" + tableNum
        };

        //append table
        $("#table").append($element);

        //make it draggable and resizable
        $element.draggable().resizable();

        $("#tempTable").attr("id", "table" + tableNum);
        $("#tempNEW").attr("id", "newBtn" + tableNum);
        $("#tempDLT").attr("id", "deleteBtn" + tableNum);
        $("#tempP").attr("id", "p" + tableNum);

        tableNum = tableNum + 1;

    }

});


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


// dialog form
$(function () {

    var num;

    var columnName;
    var tableId;

    function createTable() {
        var cName = $('#cName').val();
        var typeList = $('#typeList option:selected').text();
        var length = $('#length').val();
        var attributes = $('#attributesList option:selected').text();
        var nullCKBox = $('#nullCKBox').is(':checked');
        var indexList = $('#indexList option:selected').text();
        var aiCKBox = $('#aiCKBox').is(':checked');


        // check table already has same column's name or not
        if (obj['table' + num][cName] == null) {
            var $element = $('<div id="colDiv' + cName + num + '">' +
                '<p>' + cName + ': ' + typeList + '</p>' +
                '<input class="deleteColumn" id="' + cName + num + '" type="button" value="delete column">' +
                '<input class="editColumn" id="' + num + cName + '" type="button" value="edit column">' +
                '</div>');

            //append table
            $("#p" + num).append($element);

            obj['table' + num][cName] = {
                type: typeList,
                length: length,
                attributes: attributes,
                nullCKBox: nullCKBox,
                indexList: indexList,
                aiCKBox: aiCKBox
            };
            dialog.dialog("close");
        } else {
            alert("this column's name already exists");
        }


        console.log(obj);
        //console.log(cName + "," + typeList + "," + length + "," + attributes + "," + nullCKBox + "," + indexList + "," + aiCKBox);

    }




    function editColumn() {
        var cName = $('#cName').val();
        var typeList = $('#typeList option:selected').text();
        var length = $('#length').val();
        var attributes = $('#attributesList option:selected').text();
        var nullCKBox = $('#nullCKBox').is(':checked');
        var indexList = $('#indexList option:selected').text();
        var aiCKBox = $('#aiCKBox').is(':checked');


        // check table already has same column's name or not
        if (obj['table' + num][cName] == null) {
            var $element = $('<div id="colDiv' + cName + num + '">' +
                '<p>' + cName + ': ' + typeList + '</p>' +
                '<input class="deleteColumn" id="' + cName + num + '" type="button" value="delete column">' +
                '<input class="editColumn" id="' + num + cName + '" type="button" value="edit column">' +
                '</div>');

            //append table
            $("#p" + num).append($element);

            obj['table' + num][cName] = {
                type: typeList,
                length: length,
                attributes: attributes,
                nullCKBox: nullCKBox,
                indexList: indexList,
                aiCKBox: aiCKBox
            };
            dialog.dialog("close");
        } else {
            alert("this column's name already exists");
        }


        console.log(obj);
        //console.log(cName + "," + typeList + "," + length + "," + attributes + "," + nullCKBox + "," + indexList + "," + aiCKBox);

    }



    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Create table": createTable,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();

    });


    // add new column
    $(document).on('click', "input.newBtn", function () {
        num = this.id.replace(/^\D+/g, '');
        dialog.dialog("open");
        console.log("new");
    });



    editDialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Edit Column": editColumn,
            Cancel: function () {
                editDialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });


    // edit column
    $(document).on('click', "input.editColumn", function () {

        // get num from deleteBtn's id
        num = this.id.replace(/^\D+/g, '');
        columnName = this.id.replace(/[0-9]/g, '');

        // get table id
        tableId = 'table' + num;


        editDialog.dialog("open");


        $('#cName').val(columnName);
        $('#typeList option:selected').val(JSON.stringify(obj[tableId][columnName].type));
        $('#length').val(obj[tableId][columnName].length);
        $('#attributesList option:selected').val(obj[tableId][columnName].attributes);
        $('#nullCKBox').val(obj[tableId][columnName].nullCKBox);
        $('#indexList option:selected').val(obj[tableId][columnName].indexList);
        $('#aiCKBox').val(obj[tableId][columnName].aiCKBox);


    });



    /*
     $("#create-tbl").button().on("click", function () {
     dialog.dialog("open");
     });
     */
});


// dropdown list

var tableType = ['INT', 'CHARACTER', 'VARCHAR'];
var attributes = ['', 'BINARY', 'UNSIGNED', 'UNSIGNED ZEROFILL', 'on update CURRENT_TIMESTAMP'];
var indexType = ['', 'PRIMARY', 'UNIQUE'];

//table type list
$.each(tableType, function (key, value) {
    $('#typeList').append($("<option></option>").attr("value", key).text(value));
});

// attributes type
$.each(attributes, function (key, value) {
    $('#attributesList').append($("<option></option>").attr("value", key).text(value));
});

// index type
$.each(indexType, function (key, value) {
    $('#indexList').append($("<option></option>").attr("value", key).text(value));
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