"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

require(".style.css");
var form = document.querySelector('#defineform');
form.onsubmit = function() {
    var formData = new FormData(form);
    console.log(formData);
    var text = formData.get('defineword');
    console.log(text);
    return false;
}