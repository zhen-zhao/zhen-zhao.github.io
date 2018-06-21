'use strict';
var power = false;
var strict = false;
var round;
var demo = true; // if true, user can not press color blocks
var timers=[]; // hold timers created during demo and clear them when demo is interrupted
var userTimer; // user should press the next block within 5s, otherwise user loses this round, and this is the timer to keep track of it.
var userPos = 0;
var seq; // the 20 digit sequence for user to follow;

// audios
var audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var audio4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
var audios = {"1": audio1, "2": audio2, "3": audio3, "4": audio4};
var errorAudio = new Audio('http://www.pacdv.com/sounds/interface_sound_effects/beep-5.wav');
var successAudio = new Audio('http://www.jewelbeat.com/free/free-sound-effects/musical%20effects/Trumpet_1.mp3');

function initializeGame(){
  // everytime start button is clicked, "--" blink twice, and starts to count from 01
  if (power){
    demo = true;
    $("#count").html("--");
    $("#count").addClass("text-blink");
    round = 0;
    for (var x=0;x<timers.length;x++){
      clearTimeout(timers[x]);
    }
    timers = [];
    seq = generateSequence();
    setTimeout(function(){ 
      $("#count").removeClass("text-blink"); 
    }, 1200);
    setTimeout(function(){
      newRound(round);
    }, 2000);
    
  }   
}

function generateSequence(){
  var choices = ["1","2","3","4"];
  var result = "";
  for (var i=0;i<20;i++){
    result += choices[Math.floor(Math.random() * 4)];
  }
  // console.log(result);
  return result;
}

function playSounds(notes){
  // take in a string of notes, play each note out
  if (demo){
    //var n; // each note from the notes
    for (var j=0;j<notes.length;j++){
      delaySound(notes, j);
    }
    var t = setTimeout(function(){
      demo = false;
      userTimer = setTimeout(function(){
        errorHandler();
      }, 5000);
      timers.push(userTimer);
    }, 1000*notes.length);
    timers.push(t);
  }
  else {
    delaySound(notes, 0);
  }  
}

function delaySound(notes, index){
  var n = notes[index];
  var d = "#" + n;
  var timer = setTimeout(function(){    
    $(d).addClass("block-blink");
    audios[n].currentTime = 0;
    audios[n].play();
    setTimeout(function(){
      $(d).removeClass("block-blink");
    }, 600);    
    
  }, 1000*index);  
  timers.push(timer);
}

function newRound(r){
  // update count display
  if (r < 10){
    $("#count").html("0" + (r+1).toString());
  }
  else {
    $("#count").html((r+1).toString());
  }
  userPos = 0;
  playSounds(seq.slice(0, r+1));
}

function errorHandler(){
  errorAudio.play();
  $("#count").html("!!");
  $("#count").addClass("text-blink");

  // if the note was wrong, restart the round
  if (!strict){
    demo = true;
    setTimeout(function(){
      $("#count").removeClass("text-blink");
      newRound(round);
    }, 2000);   
  }
  else {
    demo = true;
    setTimeout(function(){
      $("#count").removeClass("text-blink");
      initializeGame();
    }, 2000);             
  }
}

$(document).ready(function(){
  $("input").click(function(){
    if (power){
      for (var x=0;x<timers.length;x++){
        clearTimeout(timers[x]);
      }
      timers = [];
    }
    power = !power;
    strict = false;
    $("#strict-light").removeClass("red-light");
    $("#count").toggleClass("red-text");
    $("#count").html("--");
  });
    
  
  $("#strict").click(function(){
    if (power){
      strict = !strict;
      $("#strict-light").toggleClass("red-light");
    }    
  });
  
  $("#start").click(function(){    
    initializeGame();    
  });
  
  $("#color-row .col-6").click(function(){
    clearTimeout(userTimer);
    var note = this.id;
    if (!demo){
      // after demonstration of this round
      if (note !== seq[userPos]){
        errorHandler();
      }
      else {       
        // if the note was correct, play note sound
        playSounds(this.id);
        if (userPos === round){
          // if it was the last note of the round, proceed to next round
          round += 1;
          if (round >=20){
            // if all 20 rounds were passed, celebrate!
            setTimeout(function(){
              $("#count").html("$$");
              successAudio.play();
            }, 1000);            
            demo = true;
            setTimeout(function(){
              initializeGame();
            }, 6000); 
          }
          else {
            demo = true;
            setTimeout(function(){
              newRound(round);
            }, 1500);             
          }          
        }
        else {
          //if the note was not the last one, expect the next note
          userPos += 1;
          userTimer = setTimeout(function(){
            errorHandler();
          }, 5000);
          timers.push(userTimer);
        }         
      }
    }
  });
  
});