var ticking = false;
var breakLength = 5;
var sessionLength = 25;
var session = true; //work mode or break mode
var newSession = true;
var left;
var timer;
$(document).ready(function(){
  // control lengths
  $(".col-xs-4").click(function(){
    if (!ticking){
      var ids = this.id.split("-"); // mode, change
      if (ids[0] === "break"){
        breakLength = lengthControl(breakLength, ids[1], "#break-length", !session);
      }
      else {
        sessionLength = lengthControl(sessionLength, ids[1], "#session-length", session);        
      }
      newSession = true;
      $("#filler").css("height", 250);
    }    
  });
  
  //click bottom div, toggle timer on/off
  $("#bottom").click(function(){    
    timerControl();  
  });
});

function lengthControl(length, change, target, mode){
  // mode is a boolean for session or break
  if (change === "plus"){
      length += 1;
  }
  else{
    if (length > 1){
      length -= 1;
    }
  }

  $(target).html(length);
  if (mode){ // if session mode, also update timer area
    $("#count-down").html(length);
  }
  return length;
}

  

function displayTime(length) {
  var text, hour, minute, second;
  if (ticking){
    if (left > 0){
      left -= 1;
      hour = Math.floor(left/3600).toString();
      minute = Math.floor((left - hour*3600)/60).toString();
      second = (left - hour*3600 - minute*60).toString();
      if (minute < 10){
        minute = "0"+ minute;
      }
      if (second < 10){
        second = "0" + second;
      }
      if (hour > 0){
        text = hour + ":" + minute + ":" + second;
      }
      else {
        text = minute + ":" + second;
      }
      $("#count-down").html(text);
      $("#filler").css("height", left/length*250);
      if (left === 0){
        document.getElementById("audio").play();
      }
    }
    else {
      session = !session;
      newSession = true;
      timerControl();
      $("#filler").css("height", 250);
      if (session){
        $("#role").html("SESSION");
        $("#color").css("background-color", "#C7EF7F");
      }
      else{
        $("#role").html("BREAK!");
        $("#color").css("background-color", "#F0B67F");
      }
    }
  }
  
}

function timerControl(){
  var length;
  if (session){
    length = sessionLength;
  }
  else {
    length = breakLength;
  }
  if(newSession){
    newSession = false;
    left = length * 60;
    ticking = true;
    clearInterval(timer);
    timer = setInterval(function(){
      displayTime(length*60)
    }, 1000);    
  }
  else {
    ticking = !ticking;
  }
}