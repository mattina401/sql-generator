/**
 * Created by kim on 2016-11-09.
 */
var tables = {};

var tableNum = 1;

$("#add-tbl").click(function () {

    // new table
    var $element = $('<div class="draggableResizable col-md-3" id="tables"> <input id ="tempInput" type="text" value="table name"> <input id="tempBtn" type="button" value="add"> </div>');


    tables['table' + tableNum] = tableNum;
    tableNum = tableNum + 1;
    console.log(tables);
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

// cookie handler

document.addEventListener("DOMContentLoaded", check, false);

function check() {
    if (checkCookie("name")) {
        var name = document.forms["myform"]["name"].value;
        var comment = document.forms["myform"]["comment"].value;
        var div = document.createElement("div");
        var text = document.createTextNode(getCookie("name") + " commented " + getCookie("comment"));
        div.appendChild(text);
        document.body.appendChild(text);
    }
}

function myfunction() {
    var name = document.forms["myform"]["name"].value;
    var comment = document.forms["myform"]["comment"].value;
    var div = document.createElement("div");
    var text = document.createTextNode(name + " commented " + comment);
    div.appendChild(text);
    document.body.appendChild(text);
    if (!checkCookie("name")) {
        setCookie("name", name, 365);
        setCookie("comment", comment, 365);
    }
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function checkCookie(cookie) {
    var flag = getCookie(cookie);
    if (flag != null && flag != "") {
        return true;
    }
    return false;
}