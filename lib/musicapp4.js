/*
This version works with musicapp4.html

*/

//rate CODE
console.log("in scoreapp!");


function updateModel(){
// update the boxX and yOffset fields of the partModel based on the time
// also increase position if so needed...
  c1 = (new Date()).getTime() - partModel.startTime;
  c = c1 - 333;
  totalsecs = Math.floor(c1/1000)
  mins = Math.floor(totalsecs/60)
  secs = totalsecs%60
  $("#theTime").html(mins+":"+(secs<10?"0":"")+secs)
  theSlider = $('#timeSlider');
  theSlider.val(c1);


  p = partModel.position;
  n1 = partModel.notes[p]
  n2 = partModel.notes[p+1]

  if (partModel.notes.length<p) {
    running=false;
    return;
  }

  while (c > n2.time){ //switch to the next note!
    p=p+1;
    partModel.position = p;
    n1 = partModel.notes[p]
    n2 = partModel.notes[p+1]
  }
  while (c < n1.time & p>1){
    p=p-1;
    partModel.position = p;
    n1 = partModel.notes[p]
    n2 = partModel.notes[p+1]
  }
  if (p==partModel.notes.length-1) {
    running=false;
    return;
  }

  //console.log(JSON.stringify([n1,n2]))

  partModel.currentTime =c1;
  t2 = c-n1.time;
  t1 = n2.time-c;
  t = n2.time-n1.time;
  partModel.boxX = (t1*n1.x + t2*n2.x)/t;
  partModel.yOffset = (t1*n1.yoff + t2*n2.yoff)/t;
  //console.log("x1="+n1.x+" x2="+n2.x+ "\nc="+c+
  //            " t1="+t1+" t2="+t2+" t="+t +
  //            " x="+partModel.boxX+" o="+partModel.yOffset);

}


function playLoop(){
  if (!running) {return;}
  drawPart();
  updateModel();
  window.requestAnimationFrame(playLoop);
}


// DRAWING THE VIEW USING THE MODEL

function drawPart(){
  ctx = thePartCanvas.getContext("2d");
  ctx.fillStyle="blue";
  drawImage(ctx);
  ctx.strokeStyle = 'blue';
  backgroundColor = "rgba(112,66,20,0.2)";
  foregroundColor = "rgba(255,215,0,0.2)";
  leftColor = "rgba(255,255,255,0.0)";
  ctx.fillStyle = leftColor;
  drawHighlightBox(ctx);
  ctx.fillStyle = foregroundColor;
  drawRightBox(ctx);
  ctx.fillStyle = backgroundColor;
  drawLeftBox(ctx);
  drawTopBox(ctx);
  drawBottomBox(ctx);
}



function drawImage(ctx){
  image = document.getElementById("source");
  var w = thePartCanvas.width+0.0;
  var thePart = theCurrentPart;
  var aspect = 1.0;
  switch (thePart){
    case "altus":
        aspect = imagesize.altus.height/imagesize.altus.width;
        break;
    case "cantus":
        aspect = imagesize.cantus.height/imagesize.cantus.width;
        break;
    case "tenor":
        aspect = imagesize.tenor.height/imagesize.tenor.width;
        break;
    case "bassus":
        aspect = imagesize.bassus.height/imagesize.bassus.width;
        break;
    case "score":
        aspect = imagesize.score.height/imagesize.score.width;
        break;
    default: console.log("unknown part: '"+ thePart+"'");
  }
  ctx.drawImage(image,
    partModel.xOffset*w,
    partModel.yOffset*w,
    partdiv.offsetWidth,
    Math.round(partdiv.offsetWidth*aspect)
  );
}

function drawHighlightBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    (partModel.boxX-partModel.boxWidth/2)*w,
    (partModel.boxY-partModel.boxHeight/2)*w,
    partModel.wideBoxWidth*w,
    partModel.boxHeight*w);
}

function drawRightBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    (partModel.boxX-partModel.boxWidth/2)*w,
    (partModel.boxY-partModel.boxHeight/2)*w,
    partModel.boxWidth*w,
    partModel.boxHeight*w);
}

function drawBottomBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
          (partModel.boxX-partModel.boxWidth/2)*w,
          (partModel.boxY+partModel.boxHeight/2)*w,
          4000,
          window.innerHeight);
}

function drawTopBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
      (partModel.boxX-partModel.boxWidth/2)*w,
      0,
      4000,
      (partModel.boxY-partModel.boxHeight/2)*w);
}

function drawLeftBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    0,
    0,
    (partModel.boxX-partModel.boxWidth/2)*w,
    thePartCanvas.height*w);
}


function selectThePart(part){
  thePartCanvas.width = partdiv.offsetWidth;
  console.dir(this);
  console.log("selecting part");
  var image = document.getElementById("source");
  piece = $("#thePiece").val();
  if (part=='mastermenu')
    part = 'score';
  image.src= "pieces/"+piece+"/images/"+(part+".jpg");
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);

  drawPart();

  notes = pieceData.animation[part];
  partModel.notes =notes;
  maxtime = notes[notes.length-1].time;
  attributes = {min:0,max:maxtime,step:1}
  theSlider = $('#timeSlider');
  theSlider.attr("max",maxtime).change();
  console.log('maxtime='+maxtime);
  console.log("attr-max="+theSlider.attr("max"));
}




function initPart (event){
  thePartCanvas.width = partdiv.offsetWidth;
  thePartCanvas.height = window.innerHeight; // ?????
  //thePartCanvas.width = window.innerWidth;
  //thePartCanvas.height = window.innerHeight-50;
  //partModel = Object.assign({},initialPartModel);

  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);
}



function switchPart(part){
  if (part=='mastermenu')
    part='score';
  theCurrentPart = part;
  partModel.boxHeight = pieceData.boxSize[part];
  animation = pieceData.animation;
  selectThePart(part);
  initPart();
  drawPart();
}



function switchVideo(part){
$(".musicvideo").attr("width","0%");
$("#"+part).attr("width","80%");
 video = document.getElementById(part);
}





function keydownListener(event){
  if (event.code=="KeyC") {
    startApp("cantus")
  } else if (event.code=="KeyA") {
    startApp("altus")
  } else if (event.code=="KeyT") {
    startApp("tenor")
  } else if (event.code=="KeyB") {
    startApp("bassus")
  } else if (event.code=="KeyS") {
    startApp("score")
  } else if (event.code=="KeyM") {
      startApp("mastermenu")
    }
}

function changePiece(){
  var piece=$("#thePiece").val();
  switchPiece(piece);
}

function switchPiece(piece){
  pieceData = pieceDataSet[piece];
  imagesize = pieceData.imagesize;
  notes = pieceData.animation["score"];
  partModel.notes = notes;
  partModel.position=0;
  partModel.boxHeight = pieceData.boxSize["score"];
  console.log("pieceData and partModel");
  console.dir(pieceData);
  console.dir(partModel);

  $("#score-source").attr("src","pieces/"+piece+"/videos/Master.mp4");
  $("#cantus-source").attr("src","pieces/"+piece+"/videos/Cantus.mp4");
  $("#altus-source").attr("src","pieces/"+piece+"/videos/Altus.mp4");
  $("#tenor-source").attr("src","pieces/"+piece+"/videos/Tenor.mp4");
  $("#bassus-source").attr("src","pieces/"+piece+"/videos/Bassus.mp4");
  $("#mastermenu-source").attr("src","pieces/"+piece+"/videos/MasterMenu.mp4");
  var video = document.getElementById('cantus'); video.load();video.play();video.muted=true
  var video = document.getElementById('altus'); video.load();video.play();video.muted=true
  var video = document.getElementById('tenor'); video.load();video.play();video.muted=true
  var video = document.getElementById('bassus'); video.load();video.play();video.muted=true
  var video = document.getElementById('score'); video.load();video.play();video.muted=false
  var video = document.getElementById('mastermenu'); video.load();video.play();video.muted=true


  switchVideo("score");
  switchPart("score");
  video.play();
  $("input[type='range']").val(0);
  partModel.currentTime=0;
  console.log("setting the video time!"+video.currentTime+" "+partModel.currentTime/1000.0)
  video.currentTime = partModel.currentTime/1000.0;
  running=true;
  console.dir(partModel);
  partModel.position=0;
  startTime = new Date();
  startTime = startTime.getTime();
  partModel.startTime = startTime;
  playLoop();
}


function startApp(part){
  video.muted=true
  //video.currentTime=0
  //partModel.position=0
  switchVideo(part);
  switchPart(part);
  video.muted=false;
  video.play();
  $("input[type='range']").val(0);
  //partModel.currentTime=0;
  console.log("setting the video time!"+video.currentTime+" "+partModel.currentTime/1000.0)
  video.currentTime = partModel.currentTime/1000.0;
  running=true;
  playLoop();

}



// First, we create the pieceDataSet
// this stores all the info which is unique to that piece
// the name, boxSize for each part, size for each part, animation for each part


pieceDataSet = {
  zirlerMotet:{
    pieceName: "zirlerMotet",
    boxSize:{
      altus:0.12,
      cantus:0.12,
      bassus:0.12,
      tenor:0.12,
      score:0.23
    },
    animation:{
      score:animationScoreZirler,
      cantus:animationCantusZirler,
      altus:animationAltusZirler,
      tenor:animationTenorZirler,
      bassus:animationBassusZirler
    },
    imagesize:{
       cantus:{width:2551, height:3450},
       altus:{width:2549, height:3749},
        tenor:{width:2549, height:3751},
       bassus:{width:2548, height:3749},
       score:{width:1073, height:6548}

    }
  },
  ortoMotet:{
    pieceName: "ortoMotet",
    boxSize:{
      altus:0.1,
      cantus:0.1,
      bassus:0.1,
      tenor:0.1,
      score:0.26
    },
    animation:{
      score:animationScoreOrto,
      cantus:animationCantusOrto,
      altus:animationAltusOrto,
      tenor:animationTenorOrto,
      bassus:animationBassusOrto
    },
    imagesize:{
      cantus:{width:1650, height:1275},
      altus:{width:1650, height:1275},
      tenor:{width:1650, height:1275},
      bassus:{width:1650, height:1275},
      score:{width:1140, height:2812}
     }
  }
}


theCurrentPart = "Score";
testing = true;
running = true;



thePartCanvas =  document.getElementById("thePart");
thePartCanvas.width = partdiv.offsetWidth;
thePartCanvas.height = window.innerHeight;




initialPartModel = {
  xOffset:0,
  yOffset:0,
  boxWidth:0.015,
  wideBoxWidth:4000,
  boxHeight:0.1,
  boxY:0.2,
  boxX:0,
  notes:[],
  startTime:0, // when the current song started playing
  currentTime:0, //milliseconds since the beginning of the song
  position:0, // the position in the list of notes
  note:{},  // the last note processed
  nextNote:{}, // the next note to process
};
// Notes have the form:
// {"action":"cursor","time":"0","x":355,"y":250,"yoff":92}




 video = document.getElementsByTagName("video")[0];




pieceData={};
imagesize={};
notes=[];

startTime = new Date();
startTime = startTime.getTime();
partModel = Object.assign({},initialPartModel);

//partModel.startTime = (new Date()).getTime()+340;  // maybe move this!!

//var vpromise = video.play();
//vpromise.then(function(){
//  console.log("setting video time again!")
//  video.currentTime = partModel.currentTime})

//notes = pieceData.animation["score"];
//partModel.notes = notes;
//partModel.position=0;

/*
  rangeslider -- this is the code initializing the rangeslider
*/
$('input[type="range"]').rangeslider({
  onInit: function() {
    console.log("init");
  },
  onSlide: function(pos, value) {
    console.log("pos="+pos+" val="+val);
    if (!running) {
      startTime = new Date();
      startTime = startTime.getTime();
      running=true;
      playLoop();
    }
  }
}).on('input', function() {
  //console.log("val="+this.value);
  partModel.startTime -= (this.value - partModel.currentTime)
  video.currentTime = this.value/1000.0;

});


document.addEventListener("keydown",keydownListener);


switchPiece("ortoMotet");
//switchPart("score")
//switchVideo("score")

//startApp("score");
