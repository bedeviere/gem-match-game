var $game = $game || {};

$game = {
  init: function() {
    var $grid = ["yellow","blue","yellow","red","blue","red","blue","red","blue"];
    this.gridCopy = $grid;
    var $ul = $('ul');
    this.clickCounter = 0;
    this.a = ""; // id of 1st selected cell
    this.b = "";
    this.aIndex = ""; // index of 1st selected cell
    this.bIndex = "";
    this.aClass = "";  // class of 1st selected cell
    this.bClass = "";
    this.tempClass = "";
    this.row1Win = false;
    this.row2Win = false;
    this.row3Win = false;
    this.col1Win = false;
    this.col2Win = false;
    this.col3Win = false;
    $.each($grid, function(i, cellClass){
      $ul.append("<li id='"+ i +"' class='"+ cellClass +"'></li>");
    });
    //   add click listener
    $('li').on('click', function(){
      this.cellIndex = parseFloat(this.id);
      $game.updateClickCounter(this);
    });
  },
  setVisualGrid: function(){
    this.grid = ["yellow","blue","yellow","red","blue","red","blue","red","blue"];
  },
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
    this.gridCopy.splice(this.aIndex,1,this.bClass);
    this.gridCopy.splice(this.bIndex,1,this.aClass);
    this.checkForWin();
  },
  checkForWin: function() {
      console.log(this.gridCopy);
      // check rows
      if (this.gridCopy[0] === this.gridCopy[1] && this.gridCopy[0] === this.gridCopy[2] ){
        this.row1Win = true;
      } else if (this.gridCopy[3] === this.gridCopy[4] && this.gridCopy[3] === this.gridCopy[5] ){
        this.row2Win = true;
      } else if (this.gridCopy[6] === this.gridCopy[7] && this.gridCopy[6] === this.gridCopy[8] ){
        this.row3Win = true;
      }

      // if not, check cols
      else if (this.gridCopy[0] === this.gridCopy[3] && this.gridCopy[0] === this.gridCopy[6] ){
        this.col1Win = true;
      } else if (this.gridCopy[1] === this.gridCopy[4] && this.gridCopy[1] === this.gridCopy[7] ){
        this.col2Win = true;
      } else if (this.gridCopy[2] === this.gridCopy[5] && this.gridCopy[2] === this.gridCopy[8] ){
        this.col3Win = true;
      }

      // check if any winning cols or rows
      if (this.col1Win || this.col2Win || this.col3Win || this.row1Win || this.row2Win || this.row3Win){
        console.log("We have a winner!");
      }
  }
};


$(function(){
  $game.init();
});
