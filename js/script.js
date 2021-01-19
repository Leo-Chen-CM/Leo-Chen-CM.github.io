
// get a handle to the canvas context
var canvas = document.getElementById("game");

// get 2D context for this canvas
var context = canvas.getContext("2d");

var spritesheet = new Image();
spritesheet.src = "./img/Ghost spritesheet.png";

var enemyImage = new Image();
enemyImage.src = "./img/1to6.png";


// Update Heads Up Display with Weapon Information
function weaponSelection() {
    var selection = document.getElementById("equipment").value;
    var active = document.getElementById("active");
    if (active.checked == true) {
      document.getElementById("HUD").innerHTML = selection + " active ";
      console.log("Weapon Active");
    } else {
      document.getElementById("HUD").innerHTML = selection + " selected ";
      console.log("Weapon Selected");
    }
  }
  
  // Draw a HealthBar on Canvas, can be used to indicate players health
  function drawHealthbar() {
    var width = 150;
    var height = 20;
    var max = 100;
    var val = 100;
  
    // Draw the background
    context.fillStyle = "#000000";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(player.x, player.y - 100, width, height);

    // Draw the fill
    context.fillStyle = "#00FF00";
    var fillVal = Math.min(Math.max(val / max, 0), 1);
    context.fillRect(player.x, player.y - 100, fillVal * width, height);

  }
  
  // Array of Weapon Options
  var options = [{
      "text": "Select a Weapon",
      "value": "No Weapon",
      "selected": true
    },
    {
      "text": "Spear",
      "value": "Javelin"
    },
    {
      "text": "Sword",
      "value": "Longsword"
    },
    {
      "text": "Crossbow",
      "value": "Pistol crossbow"
    }
  ];
  
  var selectBox = document.getElementById('equipment');
  
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    selectBox.options.add(new Option(option.text, option.value, option.selected));
  }
  


context.scale(0.5,0.5);

var frames = 6;

var currentFrame = 0;

function GameObject(name, img, health) {
    this.name = name;
    this.img = img; //Can hold img files
    this.health = health;
    this.x = 0;
    this.y = 0;
}

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input

// Default Player
var player = new GameObject("Player", spritesheet, 100);
player.x = 100;
player.y = 100;

var enemy = new GameObject("Enemy", enemyImage, 100);
enemy.x = 400;
enemy.y = 400;
// Gameobjects is a collection of the Actors within the game
// An Array

var initial = new Date().getTime();
var current; // current time

function animate() 
{
    current = new Date().getTime(); // update current
    if (current - initial >= 500) { // check is greater that 500 ms
        currentFrame = (currentFrame + 1) % frames; // update frame
        initial = current; // reset initial
    } 

}
// Draw GameObjects to Console
// Modify to Draw to Screen
function draw() 
{
    // Clear Canvas
    // Iterate through all GameObjects
    // Draw each GameObject


    //console.log("Should be drawing");
    context.clearRect(0, 0, 1000, 1000);

    drawHealthbar();


    context.drawImage(player.img, (player.img.width / 6) * currentFrame, 0 ,player.img.width / 6, player.img.height, player.x, player.y, 150, 150);
    animate();

    context.drawImage(enemy.img, (enemy.img.width / 6) * currentFrame, 0, enemy.img.width / 6, enemy.img.height, enemy.x, enemy.y, 150, 150);
    //console.log("Should be drawing");
    //console.log("X: " + enemy.x + "  Y: " + enemy.y);

}


//Up
function buttonOnClickYellow(){
    player.y -= 100;
    console.log("Y = Up");
    console.log(player.name + " at X: " + player.x + "  Y: " + player.y);
}

//Left
function buttonOnClickBlue(){
    player.x -= 100;
    console.log("Blue = Left");
    console.log(player.name + " at X: " + player.x + "  Y: " + player.y);
}

//Right
function buttonOnClickRed(){
    player.x += 100;
    console.log("Red = Right");
    console.log(player.name + " at X: " + player.x + "  Y: " + player.y);
}

//Down
function buttonOnClickGreen(){
    player.y += 100;
    console.log("Green = Down");
    console.log(player.name + " at X: " + player.x + "  Y: " + player.y);
}


function gameloop() 
{
    draw();
    window.requestAnimationFrame(gameloop);
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);
