var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d"); //creating drawing context in c
var ticker = 0;
var randomIncrement = 30;
var randomIncrement2 = 70;
var groundHeight = 100;

c.fillRect(window.innerWidth/2, window.innerHeight/2, 310 , 30) // x position, y position, width and height

var stars = [];
var frontStars = [];
var shatterParticles = [];



const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, "#0B486B")
backgroundGradient.addColorStop(0.55, "#C04848")
backgroundGradient.addColorStop(1, "#FA2750")
const fontGradient = c.createLinearGradient(0,0,0, canvas.height);
fontGradient.addColorStop(0, "#0A0D0F")
fontGradient.addColorStop(1, "#041724")
const mountainGradient = c.createLinearGradient(0,0,0, canvas.height);
mountainGradient.addColorStop(0, "#493B5E")
mountainGradient.addColorStop(0.4, "#493B5E")
mountainGradient.addColorStop(1, "#5F6A97")
const mountainGradient2 = c.createLinearGradient(0,0,0, canvas.height);
mountainGradient2.addColorStop(0, "#0F224A")
mountainGradient2.addColorStop(0.4, "#0F224A")
mountainGradient2.addColorStop(1, "#4F5A87")
const mountainGradient3 = c.createLinearGradient(0,0,0, canvas.height);
mountainGradient3.addColorStop(0, "#071637")
mountainGradient3.addColorStop(0.5, "#071637")
mountainGradient3.addColorStop(0.7, "#051B40")
mountainGradient3.addColorStop(1, "#2B2D41")
const groundGradient = c.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
groundGradient.addColorStop(0, "#040813")
groundGradient.addColorStop(1, "#03030D")

class Object{
  constructor(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
}

class Star extends Object{
  constructor(x, y, radius, color){
    super(x, y, radius, color)
    this.velocity = {
      x:4,
      y:7
    }
    this.beam = {
      start: ticker + this.radius*randomInt(-3, 3),
      end: ticker + this.radius*randomInt(8, 12),
      head: {
        x: null,
        y: null
      },
      maxlength: this.radius * randomInt(30, 50)
    }
    this.start = {
      x: null,
      y: null
    }
    this.end = {
      x: null,
      y: null
    }
    this.started = false;
    this.faded = false;
  }

  draw(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  create(){
    if(ticker > this.beam.start && ticker < this.beam.end){
      if(this.started === false){
        this.start.x = this.x;
        this.start.y = this.y;
        this.beam.head.x = this.x;
        this.beam.head.y = this.y;
        this.started = true;
      }
      if(findDistance(this.start.x, this.start.y, this.x, this.y) > this.beam.maxlength){
        this.shrinkBeam(this.beam.head.x, this.beam.head.y, this.x, this.y);
      } else{
        this.createBeam(this.start.x, this.start.y, this.x, this.y);
        this.draw();
      }
    }
    if(ticker === this.beam.end){
      this.end.x = this.x;
      this.end.y = this.y;
    } else if(ticker> this.beam.end && this.faded === false){
      this.shrinkBeam(this.beam.head.x, this.beam.head.y, this.end.x, this.end.y);
    }
  }

  update(){
    this.create();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  createBeam(x1, y1, x2, y2){
    const starBeamGradient = c.createLinearGradient(...arguments);
    starBeamGradient.addColorStop(0, "rgba(250, 250, 250, 0.1)")
    starBeamGradient.addColorStop(1, "rgba(250, 250, 250, 1)")
    var beam = new Beam(...arguments, this.radius, starBeamGradient)
    beam.create();
  }

  shrinkBeam(x1, y1, x2, y2){
    this.createBeam(x1, y1, x2, y2);
    this.beam.head.x += this.velocity.x;
    this.beam.head.y += this.velocity.y;
    if(this.end.x && this.beam.head.x >= this.end.x){
      this.faded = true;
    }
  }
}

class Beam{
  constructor(initialX, initialY, finalX, finalY, width, fillStyle){
    this.initial= {
      x: initialX,
      y: initialY
    }
    this.final = {
      x: finalX,
      y: finalY
    }
    this.width = width;
    this.fillStyle= fillStyle
    this.opacity = 1;
  }
  create(){
    c.lineWidth = this.width;
    c.beginPath();
    c.strokeStyle = this.fillStyle;
    c.moveTo(this.initial.x, this.initial.y);
    c.lineTo(this.final.x, this.final.y)
    c.stroke();
  }
}

class FrontStar extends Object{
  constructor(x, y, radius, color){
    super(x, y, radius, color)
    this.velocity = {
      x:18,
      y:23
    }
    this.gravity = 0.2
    this.numParticles = this.radius * randomInt(4,6)
  }
  create(){
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false)
    c.fillStyle = this.color;
    c.shadowColor = this.color;
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
  }
  update(){
    this.create();
    if(this.y + this.radius >= canvas.height-groundHeight){
      this.radius = 0;
      this.shatter();
    } else{
      this.velocity.y += this.gravity;
      this.velocity.x += this.gravity
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
  shatter(){
    for(let i = 0; i < this.numParticles ; i++){
      var particle = new ShatterParticles(this.x, this.y, randomInt(1, 5), "rgba(250, 250, 250, 0.8)")
      particle.create();
      shatterParticles.push(particle)
    }
  }
}

class ShatterParticles extends Object{
  constructor(x, y, radius, color){
    super(x, y, radius, color)
    this.velocity ={
      x: randomInt(-15, 35),
      y: randomInt(-30, -3)
    };
    this.gravity = 0.2
    this.lifespan = randomInt(40, 100);
    this.opacity = 1;
  }
  create(){
    c.save()
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false)
    c.fillStyle = this.color;
    c.shadowColor = this.color;
    c.shadowBlur = 10;
    c.fill();
    c.closePath();
    c.restore()
  }
  update(){
    this.create();
    this.shimmer();
    this.x += this.velocity.x * 0.6;
    this.y += this.velocity.y * 0.6;
    this.velocity.x = this.velocity.x * 0.96;
    this.velocity.y = this.velocity.y * 0.96;
    if(this.radius > 0.1){
      this.radius -= 0.05
    }
    this.lifespan -= 1;
  }
  shimmer(){
    if(ticker % 10 ===0){
      if(Math.random() > 0.5){
        this.color = "rgba(250, 250, 250, 0.2)";
      } else{
        this.color = "rgba(250, 250, 250, 0.8)";
      }
    }
  }
}

class Mountain{
  constructor(firstX, firstY, secondX, secondY, thirdX, thirdY, color){
    this.first = {
      x : firstX,
      y : firstY
    }
    this.second = {
      x : secondX,
      y : secondY
    }
    this.third = {
      x : thirdX,
      y : thirdY
    }
    this.color= color;
  }
  create(){
    c.beginPath();
    c.moveTo(this.first.x, this.first.y)
    c.lineTo(this.second.x, this.second.y)
    c.lineTo(this.third.x, this.third.y)
    c.lineTo(this.first.x, this.first.y)
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}


//Utility Functions
function randomInt(minInt, maxInt){
  return Math.floor(randomNum(minInt, maxInt));
}

function randomNum(minNum, maxNum){
  var difference = maxNum - minNum;
  var mid = difference/2 + minNum;
  var r = (Math.random() - 0.5)* difference;
  return mid + r;
}

function findSlope(x1, y1, x2, y2){
    return (y2 - y1)/(x2 - x1);
}

function findDistance(x1, y1, x2, y2){
    let a = Math.abs(x2 - x1);
    let b = Math.abs(y2 - y1);
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}



function createMountainRange(mountainAmount, maxHeight, color){
  for(let i = 0; i< mountainAmount; i++){
    const mountainWidth = canvas.width/ mountainAmount;
    var mountain = new Mountain(i* mountainWidth - 250, canvas.height,
      i* mountainWidth + mountainWidth + 250, canvas.height,
      i* mountainWidth + mountainWidth/2, canvas.height - maxHeight, color);
    mountain.create();
  }
}

function drawGround(height, color){
  c.beginPath();
  c.moveTo(0, canvas.height)
  c.lineTo(canvas.width, canvas.height)
  c.lineTo(canvas.width, canvas.height - height)
  c.lineTo(0, canvas.height - height)
  c.lineTo(0, canvas.height)
  c.fillStyle = color;
  c.fill();
  c.closePath();
}

function animate(){
  requestAnimationFrame(animate)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  if(ticker % randomIncrement === 0){
    var randomSize = randomInt(1,5);
    let star = new Star(randomInt(-20, canvas.width), 0, randomSize, "rgba(250, 250, 250, 0.8)");
    star.create();
    stars.push(star);
    randomIncrement = randomInt(20, 90)
  }

  stars.forEach(function(star, index){
    star.update()
  })

  createMountainRange(1, canvas.height*3/4, mountainGradient)
  createMountainRange(2, canvas.height*3/4- 20, mountainGradient2)
  createMountainRange(3, canvas.height*3/4- 50, mountainGradient3)

  if(ticker % randomIncrement2 ===0){
    let frontStar = new FrontStar(randomInt(0, canvas.width-600), 10, randomInt(15, 25), "white");
    frontStar.create();
    frontStars.push(frontStar)
    randomIncrement2 = randomInt(150, 300)
  }

  frontStars.forEach(function(frontStar, index){
    frontStar.update();
  })

  drawGround(groundHeight, groundGradient)

  shatterParticles.forEach(function(particle, index){
    particle.update();
  })

  stars = stars.filter( star => star.faded === false)
  frontStars = frontStars.filter( star => star.radius >= 5)
  shatterParticles = shatterParticles.filter( particle => particle.lifespan > 0)
  ticker ++;
}

animate()
