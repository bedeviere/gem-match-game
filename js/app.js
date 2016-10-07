var game = game || {};

game = {
  init: function() {
    this.grid = ["yellow","blue","yellow","red","yellow","red","blue","red","blue"];
    var $ul = $('ul');
    this.clickCounter = 0;
    this.a = ""; // id of 1st selected cell
    this.b = "";
    this.aIndex = ""; // index of 1st selected cell
    this.bIndex = "";
    this.aClass = "";  // class of 1st selected cell
    this.bClass = "";
    this.tempClass = "";
    this.row1 = this.grid.slice(0,3);
    this.row2 = this.grid.slice(3,6);
    this.row3 = this.grid.slice(6,9);
    this.row1Win = false;
    this.row2Win = false;
    this.row3Win = false;
    this.col1Win = false;
    this.col2Win = false;
    this.col3Win = false;

    $.each(this.grid, function(i, cellClass){
      $ul.append("<li id='"+ i +"' class='"+ cellClass +"'></li>");
    });

    //   add click listener
    $('li').on('click', function(){
      // $(this).addClass('selected'); // messes up the currentClass
      this.cellIndex = parseFloat(this.id);
      game.updateClickCounter(this);
    });
  },
  // setVisualGrid: function(){
  //   this.grid = this.grid;
  // },
  updateClickCounter: function(e){
    // this.cellClicked = e.target;
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
      if (this.bIndex === this.aIndex + 3 || this.bIndex === this.aIndex -3 || this.bIndex === this.aIndex-1 || this.bIndex === this.aIndex + 1){
        this.updateGridDisplay();
      } else {
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

    // ----------- START: WORKING "WET" LOGIC ----------------
    // var winningRows = [];
    // // console.log(this.row1 + this.row2 + this.row3);
    // if (this.row1[1] === this.row1[0] && this.row1[1] === this.row1[2]){
    //   winningRows.push(1);
    //   // console.log(winningRows);
    // }
    // if (this.row2[1] === this.row2[0] && this.row2[1] === this.row2[2]){
    //   winningRows.push(2);
    //   // console.log(winningRows);
    // }
    // if (this.row3[1] === this.row3[0] && this.row3[1] === this.row3[2]){
    //   winningRows.push(3);
    //   // console.log(winningRows);
    // }
    //
    // if (winningRows){
    //   this.grid.splice(3,3);
    //   this.grid.splice(0,0,"new0","new1","new2");
    //
    //   // update grid
    //   setTimeout(this.updateGrid.bind(this),1000);
    // }
    // ----------- END: WORKING "WET" LOGIC ----------------


    // ----------- START: WORKING "DRY" LOGIC ----------------
    this.grid = []; // empty grid ready to re-build
    var numRows = 3;
    var numCols =2;
    var rowsToCheck = [this.row1,this.row2,this.row3];
    var paircount = 0;
    var self = this;
    var match = false;

    rowsToCheck.forEach(function(currentRow, i){
      paircount = 0;
      // Check cols
      for (var i = 0; i < numCols; i++){
        if (currentRow[i] === currentRow[i+1]){
          paircount++;
        } else {
          paircount=0;

        }

        // IF there is a match, run function to add new row
        if (paircount === 2){
          console.log("Append new row");
          match = true;
          // self.reBuildGrid();
        } else if (paircount === 0 && i >=1 || paircount === 1 && i >=1){
          self.grid.push(currentRow[0],currentRow[1],currentRow[2]);
        }
      }
    });
     // Add new row at start of array
    if (match) {self.grid.splice(0,0,'new1','new2','new2');}
    setTimeout(self.updateGrid.bind(self),1000);

    // ----------- END: WORKING "DRY" LOGIC ----------------
  },
  checlColsForWin: function(){

    // // if not, check cols
    // else if (this.grid[0] === this.grid[3] && this.grid[0] === this.grid[6] ){
    //   this.col1Win = true;
    // } else if (this.grid[1] === this.grid[4] && this.grid[1] === this.grid[7] ){
    //   this.col2Win = true;
    // } else if (this.grid[2] === this.grid[5] && this.grid[2] === this.grid[8] ){
    //   this.col3Win = true;
    // }
  },
  updateGrid: function(){
    var self = this;
    // var $gridCopy = this.grid;
    $.each($('li'), function(i, li){
      console.log(li, self.grid[i]);
      $(li).removeClass("red blue yellow").addClass(self.grid[i]);
    });
  }
};


$(function(){
  game.init();
});
