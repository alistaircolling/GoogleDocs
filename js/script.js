var canvas = document.getElementById('surface');
var context = canvas.getContext('2d');
var data;
var font = "Arial";
var colorSkew = 18;
console.log("hiya");


context.beginPath();
context.rect(0,0,600,600);
context.fillStyle = '#7a7a7a';
context.fill();

var titles;


function init(){
  addListeners();
}

function addListeners(){

   var button = document.getElementById("button");
   // add onclick event
   button.onclick = function() {
        alert("thankyou");
   }
}

function spreadsheetLoaded(dat){
  console.log("---SPREADSHEET LOADED---");
  console.log(dat);
  data = dat;
//  var int=self.setInterval(function(){render()},500);
  createGrid(dat);

}

function render(){
  createGrid(data);
}

function drawCircle(x, y, radius, color){
  context.beginPath();
  context.fillStyle = color;
  context.arc(x,y,radius,0,Math.PI*2);
  context.fill();
}

function drawRect(x, y, radius, color){
  context.beginPath();
  context.fillStyle = color;
  context.rect(x-(radius*.5),y-(radius*.5),100,radius);
  context.fill();
}

function writeWord(x,y,text){
  context.font = 12+"px "+font;
  context.fillStyle = "#ffffff";
  context.fillText(text, x+20, y+20);
}

function createGrid(data){
//   canvas.width = canvas.width;

  var everything = data.feed.entry;

  var topRow = parseFloat(data.feed.gs$rowCount.$t);
  var topCol = parseFloat(data.feed.gs$colCount.$t);

  var i, j, xPos, yPos, index, radius, color, value;

  for(i=0; i<topCol;i++){
    for(j=0; j<topRow; j++){
      xPos = i*(600/topCol);
      yPos = j*(300/topRow);
      index  = (j*topCol)+(i%topCol);
      value = everything[index].content.$t;
      radius = value*2;
      color = "hsla("+(colorSkew*radius)+",70%,60%,1)";
      var num = parseInt(value);
      if (isNaN(num) || value.indexOf("/") !== -1){
        //is a string
        writeWord(xPos,yPos,value);
      }else{
        //is a number so draw a circle
        if (i%2==0){
          drawCircle(xPos+40, yPos, radius,color);
        }else{
          drawRect(xPos+40, yPos, radius,color);
        }
      }

    }
  }
}
init();


