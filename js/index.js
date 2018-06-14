'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
  function Board() {
    var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Board);

    this.board = [[null, null, null], [null, null, null], [null, null, null]];
    if (board) {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          this.board[i][j] = board[i][j];
        }
      }
    }
  }

  _createClass(Board, [{
    key: "square",
    value: function square(row, col) {
      return this.board[row][col];
    }
  }, {
    key: "getBoard",
    value: function getBoard() {
      return this.board;
    }
  }, {
    key: "move",
    value: function move(row, col, player) {
      if (!this.board[row][col]) {
        this.board[row][col] = player;
      }
    }
  }, {
    key: "checkSquare",
    value: function checkSquare(row, col) {
      return this.board[row][col];
    }
  }, {
    key: "getEmptySquares",
    value: function getEmptySquares() {
      var empties = [];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (!this.board[i][j]) {
            empties.push([i, j]);
          }
        }
      }
      return empties;
    }
  }, {
    key: "checkWin",
    value: function checkWin() {
      var b = this.board;
      var lines = [];
      // rows
      lines = lines.concat(b);
      // cols
      for (var col = 0; col < 3; col++) {
        var temp = [];
        for (var row = 0; row < 3; row++) {
          temp.push(b[row][col]);
        }
        lines.push(temp);
      }

      // diags
      var diag1 = [];
      for (var x = 0; x < 3; x++) {
        diag1.push(b[x][x]);
      }
      lines.push(diag1);

      var diag2 = [];
      for (var y = 0; y < 3; y++) {
        diag2.push(b[y][2 - y]);
      }
      lines.push(diag2);
      // check all lines
      for (var z = 0; z < lines.length; z++) {
        var line = lines[z];
        var s = new Set(line);
        if (s.size === 1 && line[0] !== null) {
          return [line[0], z];
        }
      }

      // no winner, check for draw
      if (this.getEmptySquares().length === 0) {
        return ["draw"];
      }

      // game is still in progress
      return null;
    }
  }]);

  return Board;
}();

function switchPlayer(player) {
  if (player === "X") {
    return "O";
  } else {
    return "X";
  }
}

function pickSquare(b) {
  var squares = b.getEmptySquares();
  return squares[Math.floor(Math.random() * squares.length)];
}

// Monte Carlo simulator
function mcTrial(b, player) {
  // during the trial, keep making random moves for each side
  var tempPlayer = player;
  while (!b.checkWin()) {
    var m = pickSquare(b);
    b.move(m[0], m[1], tempPlayer);
    tempPlayer = switchPlayer(tempPlayer);
  }
}

function mcUpdateScores(b, scores, player) {
  // update the score of each individual cells
  var w = b.checkWin()[0];
  var other = switchPlayer(player);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (b.square(i, j) === player) {
        if (w === player) {
          scores[i][j] += 1;
        } else if (w === other) {
          scores[i][j] -= 1;
        }
      } else if (b.square(i, j) === other) {
        if (w === player) {
          scores[i][j] -= 1;
        } else if (w === other) {
          scores[i][j] += 1;
        }
      }
    }
  }
}

function bestMove(b, scores, player) {
  // find the empty square with max scores after trials
  var emp = b.getEmptySquares();
  // initialize maxScore with the score of the first empty square
  var maxScore = scores[emp[0][0]][emp[0][1]];
  for (var i = 0; i < emp.length; i++) {
    if (scores[emp[i][0]][emp[i][1]] > maxScore) {
      maxScore = scores[emp[i][0]][emp[i][1]];
    }
  }
  var maxSquares = [];
  // find out which squares hold the maxScore
  for (var j = 0; j < emp.length; j++) {
    if (scores[emp[j][0]][emp[j][1]] === maxScore) {
      maxSquares.push(emp[j]);
    }
  }
  return maxSquares[Math.floor(Math.random() * maxSquares.length)];
}

function mcMove(b, player, trials) {
  // after a number of trials return the best square for player to move
  var clone = new Board(b.getBoard());
  var scores = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (var i = 0; i < trials; i++) {
    mcTrial(clone, player);
    mcUpdateScores(clone, scores, player);
    clone = new Board(b.getBoard());
  }
  return bestMove(b, scores, player);
}

function clearBoard() {
  $(".col-4").html("");
  $(".col-4").css({ "color": "black", "font-size": "30px", "padding-top": "25px" });
}

function displayResult(player) {
  var effect = "fade";
  if (player === "draw") {
    $("#message").html("It's a tie!");
  } else if (player === computer) {
    cScore += 1;
    $("#cScore").html(cScore.toString());
    $("#message").html("Computer Won!");
  } else {
    uScore += 1;
    $("#uScore").html(uScore.toString());
    $("#message").html("You Won!");
    $("#message").css("color", "#EB5160");
    effect = "bounce";
  }
  // $("#message").effect("shake", {times: 5}, 1500);
  $("#grid").toggle("explode", 300, function () {
    $("#message").toggle(effect, { times: 3 }, 1000);
  });
  setTimeout(function () {
    $("#message").toggle("fade", { times: 3 }, 500, function () {
      $("#grid").toggle("explode", 500);
      $("#message").css("color", "black");
    });
  }, 3000);
}

function gaming() {
  var winner = board.checkWin();
  if (winner) {
    board = new Board();
    if (winner[0] === "draw") {
      var chance = Math.random();
      if (chance > 0.5) {
        current = user;
      } else {
        current = computer;
      }
    } else {
      var styles = { "color": "#EB5160", "font-size": "50px", "padding-top": "10px" };
      switch (winner[1]) {
        case 0:
          $("#0, #1, #2").css(styles);
          break;
        case 1:
          $("#3, #4, #5").css(styles);
          break;
        case 2:
          $("#6, #7, #8").css(styles);
          break;
        case 3:
          $("#0, #3, #6").css(styles);
          break;
        case 4:
          $("#1, #4, #7").css(styles);
          break;
        case 5:
          $("#2, #5, #8").css(styles);
          break;
        case 6:
          $("#0, #4, #8").css(styles);
          break;
        case 7:
          $("#2, #4, #6").css(styles);
          break;
      };
      current = winner[0];
    }
    setTimeout(function () {
      displayResult(winner[0]);
      clearBoard();
      if (current === computer) {
        setTimeout(function () {
          gaming();
        }, 4000);
      }
    }, 1000);
  } else {
    if (current === computer) {
      var choice = mcMove(board, computer, 50);
      board.move(choice[0], choice[1], computer);
      document.getElementById((choice[0] * 3 + choice[1]).toString()).innerHTML = computer;
      current = user;
      gaming();
    } else {
      if (userMoved) {
        board.move(userChoice[0], userChoice[1], user);
        document.getElementById((userChoice[0] * 3 + userChoice[1]).toString()).innerHTML = user;
        userMoved = false;
        current = computer;
        gaming();
      }
    }
  }
}

var choose = $("#dialog").dialog({
  dialogClass: "no-close",
  autoOpen: false,
  height: 200,
  width: 400,
  modal: true,
  position: { my: "center", at: "center", of: "#grid" },
  buttons: {
    "X": function X() {
      user = current = "X";
      computer = "O";
      $(".ui-dialog").effect("fade", 500);
      $(this).dialog("close");
    },
    "O": function O() {
      user = current = "O";
      computer = "X";
      $(".ui-dialog").effect("fade", 500);
      $(this).dialog("close");
    }
  }
});

function resetGame() {
  board = new Board();
  clearBoard();
  uScore = 0;
  $("#uScore").html("0");
  cScore = 0;
  $("#cScore").html("0");
  choose.dialog("open");
  $(".ui-dialog").effect("bounce", 1000);
  return false; // THIS SEEMS TO BE THE KEY TO PREVENT DIALOG MOVES UP AFTER THE SECOND CALL TO DIALOG OPEN
}

var user;
var computer;
var board = new Board();
var uScore = 0;
var cScore = 0;
var current;
var userChoice;
var userMoved;

$(document).ready(function () {
  choose.dialog("open");
  $(".ui-dialog").effect("bounce", 1000);

  $(".col-4").click(function () {
    if (current === user) {
      var id = parseInt(this.id);
      userChoice = [parseInt(id / 3), id % 3];
      if (!board.checkSquare(userChoice[0], userChoice[1])) {
        userMoved = true;
        gaming();
      }
    }
  });

  $("#reset").click(function () {
    resetGame();
  });
});