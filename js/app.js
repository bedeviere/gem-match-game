var game = game || {};

game = {
  generateGrid: function(){
    this.grid =[];
    this.choice = "";

    if (this.currentLevel === 1){
      this.numCells = 9;
      this.colors = ["yellow","blue","red"];
    } else if (this.currentLevel === 2){
      this.numCells = 16;
      this.colors = ["yellow","blue","red","purple"];
    }

    for (var i=0;i<this.numCells;i++){
      var randCol = [Math.floor(Math.random() * this.colors.length)];
      this.choice = this.colors[randCol];
      this.grid.push(this.colors[randCol]);
    }
  },
  init: function() {
    this.currentLevel = 2;
    this.$levelDisplay = $('#level').text(this.currentLevel);
    $('#board').addClass("level"+this.currentLevel);

    this.generateGrid();

    var $ul = $('ul');

    this.score = 0;
    this.$scoreBoard = $('#score').text(this.score);

    var $timer = $('timer');
    this.clickCounter = 0;
    this.a = ""; // id of 1st selected cell
    this.b = "";
    this.aIndex = ""; // index of 1st selected cell
    this.bIndex = "";
    this.aClass = "";  // class of 1st selected cell
    this.bClass = "";
    this.tempClass = "";

    $.each(this.grid, function(i, cellClass){
      $ul.append("<li id='"+ i +"' class='"+ cellClass +"'></li>");
    });

    //   add click listener
    $('li').on('click', function(){
      // $(this).addClass('selected'); // messes up the currentClass
      this.cellIndex = parseFloat(this.id);
      game.updateClickCounter(this);
    });

    this.checkRowsForWin(); // random generator might create matches on setup
  },
  updateClickCounter: function(e){

    this.currentClass = e.className;
    this.cellIndex = parseFloat(e.id);

    this.clickCounter ++;

    if (this.clickCounter === 1){
      this.aClass = this.currentClass;
      this.aIndex = this.cellIndex;
      this.a = e;

    } else if (this.clickCounter >= 2) {
      this.bClass = this.currentClass;
      this.bIndex = this.cellIndex;
      this.b = e;

      // check valid selection
      if (this.currentLevel === 1){
        if (this.bIndex === this.aIndex + 3 || this.bIndex === this.aIndex -3 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1)
        {
          this.updateGridDisplay();
        }
        else {
          console.log("NO MOVE");
        }
      } else if (this.currentLevel === 2){
        if (this.bIndex === this.aIndex + 4 || this.bIndex === this.aIndex -4 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1)
        {
          this.updateGridDisplay();
        }
        else {
          console.log("NO MOVE");
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
    this.row1 = this.grid.slice(0,3);
    this.row2 = this.grid.slice(3,6);
    this.row3 = this.grid.slice(6,9);
    this.checkRowsForWin();
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
  checkRowsForWin: function() {

    // ---------------- START: LEVEL 1 - WORKING ----------------
    // var numRows= 0;
    // var numCols = 0;
    // var rowsToCheck = [];
    // var colors;
    //
    // if (this.currentLevel === 1) {
    //   this.row1 = this.grid.slice(0,3); // for use when re-running check
    //   this.row2 = this.grid.slice(3,6);
    //   this.row3 = this.grid.slice(6,9);
    //   numRows = 3;
    //   numCols = 2;
    //   rowsToCheck = [this.row1,this.row2,this.row3];
    //   colors = ["yellow","blue","red"];
    // } else if (this.currentLevel === 2){
    //   this.row1 = this.grid.slice(0,4); // for use when re-running check
    //   this.row2 = this.grid.slice(4,8);
    //   this.row3 = this.grid.slice(8,12);
    //   this.row4 = this.grid.slice(12,16);
    //   numRows = 4;
    //   numCols = 3;
    //   rowsToCheck = [this.row1,this.row2,this.row3,this.row4];
    //   colors = ["yellow","blue","red","purple"];
    // }
    // this.grid = []; // empty grid ready to re-build
    // var paircount = 0;
    // var self = this;
    // var match = false;
    // var cellsToFill = 0;
    // this.newRow = [];
    // var choice = "";
    // game.reCheckRow = false;
    // this.checkCols = true;
    //
    // rowsToCheck.forEach(function(currentRow, i){
    //   paircount = 0;
    //   // Check cols within row
    //   for (var i = 0; i < numCols; i++){
    //     if (currentRow[i] === currentRow[i+1]){
    //       paircount++;
    //     } else {
    //       paircount=0;
    //     }
    //
    //     // IF there is a match, update score and add new row
    //     if (paircount === 2){
    //       // Update score and scoreboard
    //       game.score += 10;
    //       game.$scoreBoard.text(game.score);
    //
    //       // set it to recheck rows
    //       match = true;
    //       game.reCheckRow = true; // Prevents infinite loop of checking
    //
    //       // Set number of new rows needed to be generated
    //       cellsToFill = cellsToFill + 3;
    //
    //     } else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
    //       self.grid.push(currentRow[0],currentRow[1],currentRow[2]);
    //     }
    //   }
    // });
    // // Add new row at start of array
    // if (match) {
    //
    //   // Build array of random colors
    //   for (var i=0;i< cellsToFill;i++){
    //     var randCol = [Math.floor(Math.random() * colors.length)];
    //     choice = colors[randCol];
    //     this.newRow.push(colors[randCol]);
    //   }
    //
    //   // Break apart new row array
    //   self.a = this.newRow[0];
    //   self.b = this.newRow[1];
    //   self.c = this.newRow[2];
    //   self.d = this.newRow[3];
    //   self.e = this.newRow[4];
    //   self.f = this.newRow[5];
    //   self.g = this.newRow[6];
    //   self.h = this.newRow[7];
    //   self.i = this.newRow[8];
    //   self.j = this.newRow[9];
    //   self.k = this.newRow[10];
    //   self.l = this.newRow[11];
    //   self.m = this.newRow[12];
    //   self.n = this.newRow[13];
    //   self.o = this.newRow[14];
    //   self.p = this.newRow[15];
    //
    //   if (this.currentLevel === 1){
    //     if (cellsToFill === 6){
    //       self.grid.splice(0,0,self.a,self.b,self.c,self.d,self.e,self.f);
    //     }
    //     else if (cellsToFill === 3){
    //       self.grid.splice(0,0,self.a,self.b,self.c);
    //     }
    //   } else if (this.currentLevel === 2) {
    //     console.log("lots of cells to fill");
    //   }
    //
    //   game.reCheckCol = true;
    // }
    //
    // // Update grid
    // setTimeout(self.updateGrid.bind(self),1000);

    // ---------------- END: LEVEL 1 - WORKING ----------------

    // ---------------- START: LEVEL 2 - WORKING ----------------


    this.row1 = this.grid.slice(0,4); // for use when re-running check
    this.row2 = this.grid.slice(4,8);
    this.row3 = this.grid.slice(8,12);
    this.row4 = this.grid.slice(12,16);
    var numRows = 4;
    var numCols = 3;
    var rowsToCheck = [this.row1,this.row2,this.row3,this.row4];
    // var colors = ["yellow","blue","red","purple"];

    this.grid = []; // empty grid ready to re-build
    var paircount = 0;
    var self = this;
    var match = false;
    var cellsToFill = 0;
    this.newRow = [];
    // var choice = "";
    game.reCheckRow = false;
    this.checkCols = true;


    rowsToCheck.forEach(function(currentRow, i){
      paircount = 0;
      var a = "";
      var b = "";
      var c = "";
      var d = "";

      // Check cols within row
      for (var i = 0; i < numCols; i++){
        if (currentRow[i] === currentRow[i+1]){
          paircount++;

          if (paircount === 3) {
            game.score += 15;
            // cellsToFill = 4;
            match = true;
            a = game.randCol();
            b = game.randCol();
            c = game.randCol();
            d = game.randCol();
            // self.grid.push("new1","new2","new3","new4");
            self.grid.push(a,b,c,d);

          }
          else if (paircount === 2) {
            match = true;
            game.reCheckRow = true; // Prevents infinite loop of checking

            if (i === 2){
              game.score += 10;
              // cellsToFill = 3;
              a = game.randCol();
              b = game.randCol();
              c = game.randCol();
              self.grid.push(a,b,c);
              // self.grid.push("new1","new2","new3");
            }
          }
          else if (paircount === 1 && i ===2){
            paircount = 0;
            self.grid.push(currentRow[i],currentRow[i+1]);
          }

        }
        else if (paircount === 1 && i === 2){
          paircount = 0;
          self.grid.push(currentRow[i-1],currentRow[i],currentRow[i+1]);
        }
        else if (paircount === 1 && i === 1){
          paircount = 0;
          self.grid.push(currentRow[i-1],currentRow[i]);
        }
        else if (paircount === 2 && i === 2) {
          game.score += 10;
          cellsToFill = 3;
          match = true;
          if (currentRow[i] === currentRow[i+1]){
            a = game.randCol();
            b = game.randCol();
            c = game.randCol();
            self.grid.push(a,b,c);
            // self.grid.push("new1","new2","new3");
          } else {
            a = game.randCol();
            b = game.randCol();
            c = game.randCol();
            self.grid.push(a,b,c,currentRow[i+1]);
            // self.grid.push("new1","new2","new3",currentRow[i+1]);
          }
        }
        else {
          if (i === 2){
            self.grid.push(currentRow[i],currentRow[i+1]);
          } else {
            paircount = 0;
            self.grid.push(currentRow[i]);
          }
        }
      }
      if (match) {game.reCheckCol = true;}
    });      // end row check

    // Update grid
    setTimeout(self.updateGrid.bind(self),1000);

    // ---------------- END: LEVEL 2 - BROKEN ----------------
  },
  checkColsForWin: function(){
    if (this.currentLevel === 1){

      // ------------- START: Level 1 COLUMN check -------------
      //   // After rows have been checked, time to check the colums for matches!
      //   this.col1 = [this.grid[0],this.grid[3], this.grid[6]];
      //   this.col2 = [this.grid[1],this.grid[4], this.grid[7]];
      //   this.col3 = [this.grid[2],this.grid[5], this.grid[8]];
      //
      //   var numRows = 2;
      //   var numCols = 3;
      //   this.grid = [];
      //   var colsToCheck = [this.col1,this.col2,this.col3];
      //   var paircount = 0;
      //   var cellsToFill = 0;
      //   var self = this;
      //   var gridTemp = [];
      //   game.reCheckCol = false;
      //   var newCol = [];
      //   var colors = ["yellow","blue","red"];
      //
      //   colsToCheck.forEach(function(currentCol, i){
      //     paircount = 0;
      //     for (var i = 0; i < numRows; i++){
      //       if (currentCol[i] === currentCol[i+1]){
      //         paircount++;
      //       } else {
      //         paircount=0;
      //       }
      //
      //       if (paircount === 2){
      //
      //         // Update score and scoreboard
      //         game.score += 10;
      //         game.$scoreBoard.text(game.score);
      //
      //         // set it to recheck cols
      //         game.reCheckCol = true; // Prevents infinite loop of checking
      //
      //         // Set number of new cols needed to be generated
      //         cellsToFill = 3;
      //         for (var i=0;i< cellsToFill;i++){
      //           var randCol = [Math.floor(Math.random() * colors.length)];
      //           choice = colors[randCol];
      //           newCol.push(colors[randCol]);
      //         }
      //         self.a = newCol[0];
      //         self.b = newCol[1];
      //         self.c = newCol[2];
      //         gridTemp.push(self.a,self.b,self.c);
      //
      //         // Need to re-check the rows once the columns have been updated
      //         game.reCheckRow = true;
      //
      //       }
      //       else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
      //         gridTemp.push(currentCol[0],currentCol[1],currentCol[2]);
      //       }
      //     }
      //   });
      //   self.grid = [gridTemp[0],gridTemp[3],gridTemp[6],gridTemp[1],gridTemp[4],gridTemp[7],gridTemp[2],gridTemp[5],gridTemp[8]];
      //
      //   game.checkCols = false;
      //   setTimeout(this.updateGrid(),1000);
      // ------------- END: Level 1 COLUMN check -------------
      // ------------- START: Level 2 COLUMN check -------------
    }
    else if (this.currentLevel === 2){
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
      // var colors = ["yellow","blue","red"];

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
              // gridTemp.push("orange","black","orange","black");
              // Update score and scoreboard

              match = true;
              game.score += 15;
              game.reCheckCol = true; // Prevents infinite loop of checking
            }
            else if (paircount === 2){
              // Update score and scoreboard
              if (currentCol[i] !== currentCol[i-1]){
                gridTemp.push(currentCol[i-2],currentCol[i-1],currentCol[i-0],currentCol[i+1]);
              } else if (currentCol[i] === currentCol[i+1]){
                a = game.randCol();
                b = game.randCol();
                c = game.randCol();
                console.log("a: "+a, "b: "+b,"c: "+c);
                gridTemp.push(a,b,c,currentCol[i-2]);
                // gridTemp.push("orange","black","orange",currentCol[i-2]);
              } else {
                a = game.randCol();
                b = game.randCol();
                c = game.randCol();
                console.log("a: "+a, "b: "+b,"c: "+c);
                gridTemp.push(a,b,c,currentCol[i+1]);
                // gridTemp.push("orange","black","orange",currentCol[i+1]);
              }

              match = true;
              game.score += 10;
              game.reCheckCol = true; // Prevents infinite loop of checking
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
        game.reCheckCol = true;
        game.$scoreBoard.text(game.score);
      }

      // console.log("Temp Grid: "+gridTemp);
      self.grid = [gridTemp[0],gridTemp[4],gridTemp[8],gridTemp[12],gridTemp[1],gridTemp[5],gridTemp[9],gridTemp[13],gridTemp[2],gridTemp[6],gridTemp[10],gridTemp[14],gridTemp[3],gridTemp[7],gridTemp[11],gridTemp[15]];

      game.checkCols = false;
      setTimeout(this.updateGrid(),1000);
    }
    // ------------- END: Level 2 COLUMN check -------------

  },
  updateGrid: function(){
    var self = this;

    // --------------- START: LEVEL 1 -----------
    if (this.currentLevel === 1){
      // var self = this;

      $.each($('li'), function(i, li){
        $(li).removeClass("red blue yellow").addClass(self.grid[i]);
      });

      // if new grid doesn't match original grid, check again for match
      if (game.reCheckRow === true) {
        this.checkRowsForWin();
      } else if (this.checkCols === true) {
        this.checkColsForWin();
      }
    }
    // --------------- END: LEVEL 1 -----------

    // --------------- START: LEVEL 2 -----------
    else if (this.currentLevel === 2){
      // var self = this;
      // console.log("Grid to build: "+self.grid);
      $.each($('li'), function(i, li){
        $(li).removeClass("red blue yellow purple").addClass(self.grid[i]);
      });

      // if new grid doesn't match original grid, check again for match
      if (game.reCheckRow === true) {
        this.checkRowsForWin();
      } else if (this.checkCols === true) {
        this.checkColsForWin();
      }
    }

    // --------------- END: LEVEL 2 -----------
  }
};

$(function(){
  game.init();
});
