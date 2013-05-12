var canvas = document.getElementById('surface');
var context = canvas.getContext('2d');
var data;
var font = "Arial";
var colorSkew = 360/4;
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
      reloadData();
   }
}

function reloadData(){
  console.log("reload data");
  var url = 'https://spreadsheets.google.com/feeds/list/0AmSovoaAS4VbdHNSeDVKS0RKOXQ0cWw0TUhxM05xQ2c/od6/public/values?alt=json-in-script&callback=?';
  jQuery.getJSON(url).success(function(data) {
  spreadsheetLoaded(data);
}).error(function(message) {
    console.error('error' + message);
}).complete(function() {
    console.log('completed!');
});

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
      yPos = j*(470/topRow);
      if(j>0) yPos+=30;
      index  = (j*topCol)+(i%topCol);
      value = everything[index].content.$t;
      radius = value;
//      color = "hsla("+(colorSkew*radius)+",70%,60%,1)";
      color = "hsla("+(colorSkew*i)+",70%,60%,1)";
      var num = parseInt(value);
      if (isNaN(num) || value.indexOf("/") !== -1){
        //is a string
        writeWord(xPos,yPos,value);
      }else{
        //is a number so draw a circle
        if (i%2==0){
          drawCircle(xPos+40, yPos, radius,color);
        }else{
          drawRect(xPos, yPos, radius, color);
        }
      }

    }
  }
}
init();


