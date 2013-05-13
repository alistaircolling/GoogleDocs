var canvas = document.getElementById('surface');
var context = canvas.getContext('2d');
var ssdata;
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
   console.log("addListeners");
   var button = document.getElementById("button");
   // add onclick event
   button.onclick = function() {
      reloadData();
   }
}

function reloadData(){
  console.log("reload data");
  var url = 'https://spreadsheets.google.com/feeds/cells/0AmSovoaAS4VbdHNSeDVKS0RKOXQ0cWw0TUhxM05xQ2c/od6/public/values?alt=json-in-script&callback=?';
  jQuery.getJSON(url).success(function(data) {
    console.log("loaded!");
    spreadsheetLoaded(data);
  });

}

function spreadsheetLoaded(dat){
  console.log("---SPREADSHEET LOADED---");
  console.log(dat);
  ssdata = dat;
//  var int=self.setInterval(function(){render()},500);
 // createGrid(dat);
  loadGoogleAPI();

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
      color = "hsla("+(colorSkew*i)+","+(radius*5)+"%,50%,1)";
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
function loadGoogleAPI(){
  console.log("loadGoogleAPI");
  google.load("visualization", "1", {packages:["corechart"]});
  google.setOnLoadCallback(drawChart);
}

 function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses', 'Eggs'],
          ['2004',  1000,      400,300],
          ['2005',  1170,      460,300],
          ['2006',  660,       1120,300],
          ['2007',  1030,      540,400]
        ]);
   //create 2d array
   var topRow = parseFloat(ssdata.feed.gs$rowCount.$t);
   var topCol = parseFloat(ssdata.feed.gs$colCount.$t);
   var i,j,twoD;
   for(i=0;i<topRow;i++){
     var rowArray = [];
     for(j=0; j<topCol; j++){
     //  var newNode = ssdata.feed.entry[(i*topCol)+(j%topCol)];
       var nuNode = ssdata.feed.entry.pop();
       //console.log("newNode:"+newNode);
  //     console.log("newNode:"+nuNode);

       rowArray[j] = 1;
     }
   }



   data = google.visualization.arrayToDataTable(ssdata.feed.entry);

        var options = {
          title: 'Company Performance'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
init();


