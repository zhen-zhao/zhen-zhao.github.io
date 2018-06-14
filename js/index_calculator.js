var keys = document.getElementsByClassName("keys");
var text = "";
var number = "";
var new_op = false;
var operators = {"multiply": "x", "plus": "+", "minus": "-", "divide":"÷"}
function calc(str){
  // create postfix
  var chars = str.split("");
  var tokens = [];
  var word = "0";
  var ops = ["+", "-", "x", "÷"];
  while (chars.length > 0){
    var char = chars.shift();
    if (ops.includes(char)){
      tokens.push(word);
      tokens.push(char);
      word = "";
    }
    else {
      word += char;
    }
  }
  tokens.push(word);
  var output = [];
  var o_stack = [];
  var dict = {"+":1, "-":1, "x": 2, "÷":2};
  while (tokens.length > 0){
    var token = tokens.shift();
    if (!isNaN(token)){
      output.push(token);
    }
    else if (o_stack.length === 0){
      o_stack.push(token);
    }
    else {
      while (o_stack.length > 0 && dict[o_stack[0]]>= dict[token]){
        output.push(o_stack.shift());
      }
      o_stack.unshift(token);
    }
  }
  while (o_stack.length > 0) {
    output.push(o_stack.shift());
  }
  // parse postfix
  var n_stack = [];
  while (output.length > 0){
    var cur = output.shift();
    if (!isNaN(cur)){
      n_stack.unshift(cur);
    }
    else {
      var temp = parseFloat(n_stack.shift());
      var val;
      switch(cur) {
      case "+":
          val = temp + parseFloat(n_stack.shift());
          break;
      case "-":
          val = parseFloat(n_stack.shift()) - temp;
          break;
      case "x":
          val = temp * parseFloat(n_stack.shift());
          break;
      case "÷":
          val = parseFloat(n_stack.shift()) / temp;
          break;
      }
      n_stack.unshift(val);
    }
  }
  return parseFloat(parseFloat(n_stack[0]).toFixed(5)).toString();
  
}
function click(){
  var id = this.id;
  if (new_op) {
    if (!isNaN(id) | id === "dot"){
      text = "";
      number = "";
    }
    else {
      text = number;
    }
    // if (id !== "ce"){
    //   number = "";
    // }   
    new_op = false;
  }
  if (id == "dot"){
    if (text.length === 0 | (isNaN(text.slice(-1)) && text.slice(-1)!==".")) {
      text += "0.";
      number = "0.";
    }
    else {
      if (!number.split("").includes(".")){
        text += ".";
        number += ".";
      }

    }
  }
  else if (id == "ac") {
    text = "";
    number = "";
  }
  else if (id == "ce") {
    // if (Object.values(operators).indexOf(text.slice(-1)) === -1 && text.length > 0){
    //   number = number.slice(0, -1);
    // }
    number = number.slice(0, -1);
    text = text.slice(0, -1);
  }
  else if (id == "equal") {
    if (isNaN(text.slice(-1))) {
      text = text.slice(0, -1);
    }
    var result = calc(text);
    if (result === "Infinity"){
      number = "";
      text = result;
    }
    else {
      number = result;
      text += "=" + result;
    }
    
    new_op = true;
  }
  else if (isNaN(id)){ //operators
    if (text && isNaN(text.slice(-1))) {     
      if (text.slice(-1) === "."){
        number = number.slice(0, -1);
      }
      text = text.slice(0, -1);
    }
    text += operators[id];
  }
  else { //0-9
    if (text && isNaN(text.slice(-1)) && text.slice(-1) !== ".") {
        number = "";
    }

    text += id;
    number += id;
    if (number == 0 && !number.split("").includes(".")){
      text = text.slice(0, -number.length) + "0";
      number = "0";
    }

  }
  
  if (number.length > 11 | text.length > 20){
    $("#current").html("0");
    $("#equation").html("DIGITS EXCEEDED LIMIT");
    number = "";
    text = "";
  }
  else {
    if (!number) {
      $("#current").html("0");
    }

    else {
      $("#current").html(number);
    }
    if (!text) {
       $("#equation").html("0");
    }
    else{
       $("#equation").html(text);
    }
  }

 
}

for (var i=0;i<keys.length;i++){
  keys[i].onclick = click;
}