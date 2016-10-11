var game = game || {};

game = {
  init: function(level) {
    this.highScores = [];
    game.gameActive = true;
    this.currentLevel = level; //  CURRENT LEVEL!!

    var $levelDisplay = $('#level').text(this.currentLevel);
    $('#board').removeClass("level1 level2").addClass("level"+this.currentLevel);

    this.time = 0;
    game.l1Score ? game.score = game.l1Score : game.score = 0;
    this.$scoreBoard = $('#score').text(this.score);
    this.clickCounter = -1;

    this.generateBoard(level);
    this.addClickListeners();
    this.checkBoard();
  },
  generateBoard: function(level){
    this.grid =[];
    var choice = "";

    if (level === 1){
      this.numCells = 9;
      this.colors = ["yellow","blue","red"];
    } else if (level === 2){
      this.startTimer(45);
      this.clearBoard();
      this.numCells = 16;
      this.colors = ["yellow","blue","red","purple"];
    }

    for (var i=0;i<this.numCells;i++){

      var randCol = [Math.floor(Math.random() * this.colors.length)];
      choice = this.colors[randCol];
      this.grid.push(this.colors[randCol]);
    }

    var $ul = $('ul');
    $.each(this.grid, function(i, cellClass){
      $ul.append("<li id='"+ i +"' class='"+ cellClass +"'></li>");
    });
    $('#board').show();
  },
  addClickListeners: function(){
    $('li').off('click').on('click', function(){
      $(this).toggleClass('selected');
      game.updateClickCounter(this);
    });

    $('#resetBtn').off('click').on('click', function(){
      game.score = 0;
      game.l1Score = 0;
      game.clearBoard();
      game.init(1);
    });
  },
  clearBoard: function(){

    $('#countDown').html("");
    $('#board').hide();
    return $('ul').empty();
  },
  startTimer: function(seconds){
    clearTimeout(game.t);

    $timerDiv = $('#timer');
    $highScores = $('#highScores');
    game.time = seconds;

    game.t = setInterval(function() {
      game.time--;
      $timerDiv.text('0:'+game.time);
      if (game.time < 10){
        $timerDiv.text('0:0'+game.time);
        $('#countDown').html(game.time);
      }

      if(game.time === 0) {
        clearTimeout(game.t);
        game.gameActive = false;
        $('li').addClass('disabled');
        game.highScores.push(game.score);
        game.highScores.sort().reverse();
        game.highScores.forEach(function(score) {
          $highScores.append('<p>'+score+'</p>');
        });
      }
    }, 1000);
  },
  playSound: function(soundEffect){

    // var $sound = $('#sound');
    //
    // $sound.src="../media/audio/blop.mp3";
    // $sound.get(0).play();
  },
  updateClickCounter: function(e){

    if (!game.gameActive) {
      return;
    }
    var currentClass = e.className.replace(' selected','');
    this.cellIndex = parseFloat(e.id);

    this.clickCounter ++;

    if (this.clickCounter === 0){ // Set timer to start on first cell click
      this.startTimer(30);
      this.clickCounter ++;
    }

    if (this.clickCounter === 1){
      this.aClass = currentClass;
      this.aIndex = this.cellIndex;
      this.a = e;

    } else if (this.clickCounter === 2) {
      this.bClass = currentClass;
      this.bIndex = this.cellIndex;
      this.b = e;

      // check valid selection
      if (this.currentLevel === 1){
        if (this.bIndex === this.aIndex + 3 || this.bIndex === this.aIndex -3 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1)
        {
          // this.playSound('valid');
          this.updateGridDisplay();
        }
        else {
          e.className+=" animated shake";
          setTimeout(function(){
            $('li').removeClass('animated').removeClass('shake');
          },1000);
          $('li').removeClass('selected');
        }
      } else if (this.currentLevel === 2){
        if (this.bIndex === this.aIndex + 4 || this.bIndex === this.aIndex -4 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1)
        {
          // this.playSound('valid');
          this.updateGridDisplay();
        }
        else {
          e.className+=" animated shake";
          setTimeout(function(){
            $('li').removeClass('animated').removeClass('shake');
          },1000);
          $('li').removeClass('selected');
        }
      }
      this.clickCounter = 0;
    }
  },
  updateGridDisplay : function(){
    this.tempClass = this.aClass;
    this.a.className = this.bClass;
    this.b.className = this.tempClass;
    this.updateGridArray();
  },
  updateGridArray: function (){
    this.grid.splice(this.aIndex,1,this.bClass);
    this.grid.splice(this.bIndex,1,this.aClass);
    this.checkBoard();
  },
  randCol: function(){
    var colors = [];

    if (this.currentLevel === 1) {
      colors = ["yellow","blue","red"];
    } else if (this.currentLevel === 2){
      colors = ["yellow","blue","red","purple"];
    }

    var randNum = [Math.floor(Math.random() * colors.length)];
    var choice = colors[randNum];
    return choice;
  },
  animateOutRow: function(rowI,col1,col2,col3,col4){
    var str1 = "";
    var str2 = "";
    var str3 = "";
    var str4 = "";

    if (game.currentLevel === 2){
      if (rowI === 0) {
        col1==="" ? str1="": str1 = "li#" + col1;
        str2 = "li#" + col2;
        str3 = "li#" + col3;
        col4==="" ? str4="": str4 = "li#" + col4;
      } else if(rowI === 1){
        col1==="" ? str1="": str1 = "li#" + (col1+4);
        str2 = "li#" + (col2+4);
        str3 = "li#" + (col3+4);
        col4==="" ? str4="": str4 = "li#" + (col4+4);
      } else if (rowI === 2){
        col1==="" ? str1="": str1 = "li#" + (col1+8);
        str2 = "li#" + (col2+8);
        str3 = "li#" + (col3+8);
        col4==="" ? str4="": str4 = "li#" + (col4+8);
      } else if (rowI === 3){
        col1==="" ? str1="": str1 = "li#" + (col1+12);
        str2 = "li#" + (col2+12);
        str3 = "li#" + (col3+12);
        col4==="" ? str4="": str4 = "li#" + (col4+12);
      }
    } else if (game.currentLevel === 1){

      if (rowI === 0) {
        str1 = "li#" + col1;
        str2 = "li#" + col2;
        str3 = "li#" + col3;
      } else if(rowI === 1){
        str1 = "li#" + (col1+3);
        str2 = "li#" + (col2+3);
        str3 = "li#" + (col3+3);
      } else if (rowI === 2){
        str1 = "li#" + (col1+6);
        str2 = "li#" + (col2+6);
        str3 = "li#" + (col3+6);
      }
    }

    
    $(str1).addClass('animated zoomOut');
    $(str2).addClass('animated zoomOut');
    $(str3).addClass('animated zoomOut');
    $(str4).addClass('animated zoomOut');

    setTimeout(function(){
      $(str1).removeClass('animated zoomOut');
      $(str2).removeClass('animated zoomOut');
      $(str3).removeClass('animated zoomOut');
      $(str4).removeClass('animated zoomOut');
    },500);
  },
  animateOutCol: function(colI,col1,col2,col3,col4){

  },
  checkRowsForWinL1: function() {
    var numRows= 0;
    var numCols = 0;
    var rowsToCheck = [];
    var colors;

    this.row1 = this.grid.slice(0,3);
    this.row2 = this.grid.slice(3,6);
    this.row3 = this.grid.slice(6,9);
    numRows = 3;
    numCols = 2;
    rowsToCheck = [this.row1,this.row2,this.row3];
    colors = ["yellow","blue","red"];

    this.grid = []; // empty grid ready to re-build
    var paircount = 0;
    var self = this;
    var match = false;
    var cellsToFill = 0;
    this.newRow = [];
    var choice = "";
    game.reCheckRow = false;
    this.checkCols = true;

    rowsToCheck.forEach(function(currentRow, rowI){
      paircount = 0;
      // Check cols within row
      for (var i = 0; i < numCols; i++){
        if (currentRow[i] === currentRow[i+1]){
          paircount++;
        } else {
          paircount=0;
        }

        // IF there is a match, update score and add new row
        if (paircount === 2){
          // Update score and scoreboard
          game.score += 10;
          game.$scoreBoard.text(game.score);

          game.animateOutRow(rowI,i-1,i,i+1,"");

          // set it to recheck rows
          match = true;
          game.reCheckRow = true; // Prevents infinite loop of checking

          // Set number of new rows needed to be generated
          cellsToFill = cellsToFill + 3;

        } else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
          self.grid.push(currentRow[0],currentRow[1],currentRow[2]);
        }
      }
    });
    // Add new row at start of array
    if (match) {

      // Build array of random colors
      for (var i=0;i< cellsToFill;i++){
        var randCol = [Math.floor(Math.random() * colors.length)];
        choice = colors[randCol];
        this.newRow.push(colors[randCol]);
      }

      // Break apart new row array
      self.a = this.newRow[0];
      self.b = this.newRow[1];
      self.c = this.newRow[2];
      self.d = this.newRow[3];
      self.e = this.newRow[4];
      self.f = this.newRow[5];

      if (cellsToFill === 6){
        self.grid.splice(0,0,self.a,self.b,self.c,self.d,self.e,self.f);
      }
      else if (cellsToFill === 3){
        self.grid.splice(0,0,self.a,self.b,self.c);
      }

      game.reCheckCol = true;
    }
  },
  checkRowsForWinL2: function(){
    this.row1 = [this.grid[0],this.grid[1], this.grid[2], this.grid[3]];
    this.row2 = [this.grid[4],this.grid[5], this.grid[6], this.grid[7]];
    this.row3 = [this.grid[8],this.grid[9], this.grid[10], this.grid[11]];
    this.row4 = [this.grid[12],this.grid[13], this.grid[14], this.grid[15]];

    var numRows = 4;
    var numCols = 3;
    this.grid = [];
    var rowsToCheck = [this.row1,this.row2,this.row3, this.row4];
    var paircount = 0;
    var cellsToFill = 0;
    var self = this;
    var gridTemp = [];
    game.reCheckRow = false;
    var newCol = [];
    var match = false;

    rowsToCheck.forEach(function(currentRow, rowI){
      // var str ="";
      paircount = 0;

      for (var i = 0; i < numCols; i++){
        if (currentRow[i] === currentRow[i+1]){
          paircount++;
        }

        if (i === 2){
          if (paircount === 3){

            // Add animation
            game.animateOutRow(rowI,i-2,i-1,i,i+1);

            // add 4 new tiles
            a = game.randCol();
            b = game.randCol();
            c = game.randCol();
            d = game.randCol();

            self.grid.splice(0,0,a,b,c,d);


            // Update score and scoreboard
            match = true;
            game.score += 20;
            game.updateGridL2();
            game.time += 1;
            game.$scoreBoard.text(game.score);

          }
          else if (paircount === 2){

            if (currentRow[i] !== currentRow[i-1]){ // NOT A WIN!
              self.grid.push(currentRow[i-2],currentRow[i-1],currentRow[i-0],currentRow[i+1]);
            }
            else if (currentRow[i] === currentRow[i+1]){

              // Add animation
              game.animateOutRow(rowI,"",i-1,i,i+1);

              // Update score and scoreboard
              match = true;
              game.score += 10;
              game.$scoreBoard.text(game.score);

              a = game.randCol();
              b = game.randCol();
              c = game.randCol();

              var keepMe = [self.grid[0],self.grid[4],self.grid[8]];

              if (!keepMe[0]){ // row 1
                self.grid.push(currentRow[i-2],a,b,c);

              }
              else if (keepMe[2]){ // row 4
                self.grid.splice(0,1); // remove pos 0
                self.grid.splice(3,1); // remove pos 3
                self.grid.splice(6,1); // remove pos 6
                self.grid.splice(0,0,a,b,c); // add 3 new at start
                self.grid.splice(0,0,keepMe[0]); // re-add 0
                self.grid.splice(4,0,keepMe[1]); // re-add 4
                self.grid.splice(8,0,keepMe[2]); // re-add 8
                self.grid.splice(12,0,currentRow[i-2]); // pop 12 back

              } else if (keepMe[1]){ // row 3
                self.grid.splice(0,1); // remove 0
                self.grid.splice(3,1); // remove 3
                self.grid.splice(0,0,a,b,c); // add 3 new at start
                self.grid.splice(0,0,keepMe[0]); // re-add 0
                self.grid.splice(4,0,keepMe[1]); // re-add 4
                self.grid.splice(8,0,currentRow[i-2]); // pop 8 back

              } else if (keepMe[0]){ // row 2
                self.grid.splice(0,1); // remove 0
                self.grid.splice(0,0,a,b,c); // add 3 new at start
                self.grid.splice(0,0,keepMe[0]); // re-add 0
                self.grid.splice(4,0,currentRow[i-2]); // inject at 4

              }

              game.updateGridL2();

            }
            else {

              // Add animation
              game.animateOutRow(rowI,i-2,i-1,i,"");

              // Update score and scoreboard
              match = true;
              game.score += 10;
              game.$scoreBoard.text(game.score);

              a = game.randCol();
              b = game.randCol();
              c = game.randCol();

              var remain = [self.grid[3],self.grid[7],self.grid[11]];
              if (!remain[0]){ // row 1
                self.grid.push(a,b,c,currentRow[i+1]);
              } else if (remain[2]) { // row 4
                self.grid.splice(3,1); // remove 3
                self.grid.splice(6,1); // remove 7
                self.grid.splice(9,1); // remove 11
                self.grid.splice(0,0,a,b,c,remain[0]); // add new and re-add 3
                self.grid.splice(7,0,remain[1]); // re-add 7
                self.grid.splice(11,0,remain[2]); // re-add 11
                self.grid.push(currentRow[i+1]); // pop 15 back

              } else if (remain[1]){ // row 3
                self.grid.splice(3,1); // remove 3
                self.grid.splice(6,1); // remove 7
                self.grid.splice(0,0,a,b,c,remain[0]);  // add new and re-add 3
                self.grid.splice(7,0,remain[1]);  // re-add 7
                self.grid.push(currentRow[i+1]); // pop 11 back

              } else if (remain[0]){ // row 2
                self.grid.splice(3,1);  // remove 3
                self.grid.splice(0,0,a,b,c,remain[0]); // add new and re-add 3
                self.grid.push(currentRow[i+1]); // pop 7 back
              } else if (!self.grid){
                self.grid.push(a,b,c,currentRow[i+1]);
              }

              game.updateGridL2();
            }
          }
          else if (paircount === 1){
            self.grid.push(currentRow[i-2],currentRow[i-1],currentRow[i],currentRow[i+1]);
          }
          else if (paircount === 0){
            self.grid.push(currentRow[i-2],currentRow[i-1],currentRow[i],currentRow[i+1]);
          }
        }
      }

    });
    if (match === true) {
      game.reCheckRow = true; // Prevents infinite loop of checking
    } else {
      game.reCheckRow = false;
    }

    // self.grid = self.grid;
  },
  checkColsForWinL1: function(){
    // After rows have been checked, time to check the colums for matches!
    this.col1 = [this.grid[0],this.grid[3], this.grid[6]];
    this.col2 = [this.grid[1],this.grid[4], this.grid[7]];
    this.col3 = [this.grid[2],this.grid[5], this.grid[8]];

    var numRows = 2;
    var numCols = 3;
    this.grid = [];
    var colsToCheck = [this.col1,this.col2,this.col3];
    var paircount = 0;
    var cellsToFill = 0;
    var self = this;
    var gridTemp = [];
    game.reCheckCol = false;
    var newCol = [];
    var colors = ["yellow","blue","red"];

    colsToCheck.forEach(function(currentCol, i){
      paircount = 0;
      for (var i = 0; i < numRows; i++){
        if (currentCol[i] === currentCol[i+1]){
          paircount++;
        } else {
          paircount=0;
        }

        if (paircount === 2){

          // Update score and scoreboard
          game.score += 10;
          game.$scoreBoard.text(game.score);

          // set it to recheck cols
          game.reCheckCol = true; // Prevents infinite loop of checking

          // Set number of new cols needed to be generated
          cellsToFill = 3;
          for (var i=0;i< cellsToFill;i++){
            var randCol = [Math.floor(Math.random() * colors.length)];
            choice = colors[randCol];
            newCol.push(colors[randCol]);
          }
          self.a = newCol[0];
          self.b = newCol[1];
          self.c = newCol[2];
          gridTemp.push(self.a,self.b,self.c);

          // Need to re-check the rows once the columns have been updated
          game.reCheckRow = true;

        }
        else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
          gridTemp.push(currentCol[0],currentCol[1],currentCol[2]);
        }
      }
    });
    self.grid = [gridTemp[0],gridTemp[3],gridTemp[6],gridTemp[1],gridTemp[4],gridTemp[7],gridTemp[2],gridTemp[5],gridTemp[8]];

    game.checkCols = false;
  },
  checkColsForWinL2: function(){

    this.col1 = [this.grid[0],this.grid[4], this.grid[8], this.grid[12]];
    this.col2 = [this.grid[1],this.grid[5], this.grid[9], this.grid[13]];
    this.col3 = [this.grid[2],this.grid[6], this.grid[10], this.grid[14]];
    this.col4 = [this.grid[3],this.grid[7], this.grid[11], this.grid[15]];

    var numRows = 3;
    var numCols = 4;
    this.grid = [];
    var colsToCheck = [this.col1,this.col2,this.col3, this.col4];
    var paircount = 0;
    var cellsToFill = 0;
    var self = this;
    var gridTemp = [];
    game.reCheckCol = false;
    var newCol = [];
    var match = false;
    this.checkCols = false;

    colsToCheck.forEach(function(currentCol, i){
      paircount = 0;
      for (var i = 0; i < numRows; i++){
        if (currentCol[i] === currentCol[i+1]){
          paircount++;
        }

        if (i === 2){
          if (paircount === 3){
            // add 4 new tiles
            a = game.randCol();
            b = game.randCol();
            c = game.randCol();
            d = game.randCol();
            gridTemp.push(a,b,c,d);

            // Update score and scoreboard
            match = true;
            game.score += 20;
            game.time += 1;
          }
          else if (paircount === 2){
            // Update score and scoreboard
            if (currentCol[i] !== currentCol[i-1]){ // NO MATCH
              gridTemp.push(currentCol[i-2],currentCol[i-1],currentCol[i-0],currentCol[i+1]);

            } else if (currentCol[i] === currentCol[i+1]){
              a = game.randCol();
              b = game.randCol();
              c = game.randCol();
              gridTemp.push(a,b,c,currentCol[i-2]);

              match = true;
              game.score += 10;

            } else {
              a = game.randCol();
              b = game.randCol();
              c = game.randCol();
              gridTemp.push(a,b,c,currentCol[i+1]);

              match = true;
              game.score += 10;
            }
          }
          else if (paircount === 1){
            gridTemp.push(currentCol[i-2],currentCol[i-1],currentCol[i],currentCol[i+1]);
          }
          else if (paircount === 0){
            gridTemp.push(currentCol[i-2],currentCol[i-1],currentCol[i],currentCol[i+1]);
          }
        }
      }

    });
    if (match === true) {
      game.$scoreBoard.text(game.score);
      game.reCheckRow = true;
      game.reCheckCol = true;
    } else {
      this.reCheckCol = false;
    }

    self.grid = [gridTemp[0],gridTemp[4],gridTemp[8],gridTemp[12],gridTemp[1],gridTemp[5],gridTemp[9],gridTemp[13],gridTemp[2],gridTemp[6],gridTemp[10],gridTemp[14],gridTemp[3],gridTemp[7],gridTemp[11],gridTemp[15]];
  },
  updateGridL1: function(){
    var self = this;

    $.each($('li'), function(i, li){
      setTimeout(function(){
        $(li).removeClass("red blue yellow selected").addClass(self.grid[i]);
      },500);
    });
  },
  updateGridL2: function (){
    var self = this;

    $.each($('li'), function(i, li){
      setTimeout(function(){
        $(li).removeClass("red blue yellow purple selected animated zoomOut").addClass(self.grid[i]);
      },500);
    });
  },
  checkBoard: function(){

    if (game.currentLevel === 1){

      // If reached points count, move to next level
      if (game.score >= 200) {
        $('.levelUp').show().addClass('animated bounceIn');
        setTimeout(function(){
          $('.levelUp').addClass('animated zoomOut');
          setTimeout(function(){
            $('.levelUp').hide();
          },500);
        },1000);

        game.clearBoard();
        game.l1Score = game.score;
        game.init(2); // level 2
      } else {
        game.checkRowsForWinL1();
        var progress = ((game.score/200)*100);
        $('.progressBar').width(progress+'%');
        game.updateGridL1();
        game.checkColsForWinL1();
        game.updateGridL1();
      }
    } else if (game.currentLevel === 2){
      game.checkRowsForWinL2();
      game.updateGridL2();
      game.checkColsForWinL2();
      game.updateGridL2();
    }

    if (game.reCheckRow === true || game.reCheckCol === true ){
      game.checkBoard();
    }
  }
};

$(function(){
  game.init(1);
});
