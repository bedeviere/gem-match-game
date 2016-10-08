var game = game || {};

game = {
  generateGrid: function(){
    this.colors = ["yellow","blue","red"];
    this.numCells = 9; // future proofing for level change
    this.grid =[];
    this.choice = "";

    for (var i=0;i<this.numCells;i++){
      var randCol = [Math.floor(Math.random() * this.colors.length)];
      this.choice = this.colors[randCol];
      this.grid.push(this.colors[randCol]);
    }
  },
  init: function() {
    this.generateGrid();

    this.score = 0;
    var $ul = $('ul');
    this.$scoreBoard = $('#score').text(this.score);
    var $level = $('level');
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
      if (this.bIndex === this.aIndex + 3 || this.bIndex === this.aIndex -3 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1)
      // and move will result in row of 3
      {
        this.updateGridDisplay();
      }
      else {
        console.log("NO MOVE");
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
  checkRowsForWin: function() {
    this.row1 = this.grid.slice(0,3); // for use when re-running check
    this.row2 = this.grid.slice(3,6);
    this.row3 = this.grid.slice(6,9);
    this.grid = []; // empty grid ready to re-build
    var numRows = 3;
    var numCols =2;
    var rowsToCheck = [this.row1,this.row2,this.row3];
    var paircount = 0;
    var self = this;
    var match = false;
    var cellsToFill = 0;
    this.newRow = [];
    var colors = ["yellow","blue","red"];
    var choice = "";
    game.reCheckRow = false;
    this.checkCols = true;

    rowsToCheck.forEach(function(currentCol, i){
      paircount = 0;
      // Check cols within row
      for (var i = 0; i < numCols; i++){
        if (currentCol[i] === currentCol[i+1]){
          paircount++;
        } else {
          paircount=0;
        }

        // IF there is a match, update score and add new row
        if (paircount === 2){
          // Update score and scoreboard
          game.score += 10;
          game.$scoreBoard.text(game.score);

          // set it to recheck rows
          match = true;
          game.reCheckRow = true; // Prevents infinite loop of checking

          // Set number of new rows needed to be generated
          cellsToFill = cellsToFill + 3;

        } else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
          self.grid.push(currentCol[0],currentCol[1],currentCol[2]);
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

      if (cellsToFill > 3){
        self.grid.splice(0,0,self.a,self.b,self.c,self.d,self.e,self.f);
      }
      else {
        self.grid.splice(0,0,self.a,self.b,self.c);
      }
      game.reCheckCol = true;
    }

    // Update grid
    setTimeout(self.updateGrid.bind(self),1000);
  },
  checkColsForWin: function(){

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

    colsToCheck.forEach(function(currentRow, i){
      paircount = 0;
      for (var i = 0; i < numRows; i++){
        if (currentRow[i] === currentRow[i+1]){
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
          game.reCheckRow = false;

        }
        else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
          gridTemp.push(currentRow[0],currentRow[1],currentRow[2]);
        }
      }

    });
    self.grid = [gridTemp[0],gridTemp[3],gridTemp[6],gridTemp[1],gridTemp[4],gridTemp[7],gridTemp[2],gridTemp[5],gridTemp[8]];

    game.checkCols = false;
    this.updateGrid();
  },
  updateGrid: function(){
    var self = this;

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
};

$(function(){
  game.init();
});
