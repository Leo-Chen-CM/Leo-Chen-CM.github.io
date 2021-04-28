// get a handle to the canvas context
var canvas = document.getElementById("game");

// get 2D context for this canvas
var context = canvas.getContext("2d");
var HealthBar = [];
var cannonImage = new Image();
cannonImage.src = "./imgs/Generic Cannon.png";

var cannonImageDamaged1 =new Image();
cannonImageDamaged1.src = "./imgs/Generic Cannon Damaged.png";

var cannonImageDamaged2 =new Image();
cannonImageDamaged2.src = "./imgs/Generic Cannon Damaged 2.png";

var cannonImageDestroyed =new Image();
cannonImageDestroyed.src = "./imgs/Generic Cannon Destroyed.png";

function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
    {
      this.sound.play();
    }
    this.stop = function()
    {
      this.sound.pause();
    }
}

var gameRunning = true;

var cannonFireSound;

cannonFireSound = new sound("./sounds/cannon_fire.ogg");

var rocketImage = new Image();
rocketImage.src = "./imgs/Ammo Up.png";

var tankImage = new Image();
tankImage.src = "./imgs/Tank.png";

var score = 0;
var supplies = 10;
var ammunition = 10;

var enemySpeed = 0.1;

var resource = 0;



function GameObject(name, img, health, ammo)
{
    this.name = name;
    this.img = img;
    this.health = health;
    this.ammo = ammo;
    this.x = 0;
    this.y = 0;

}

function enemyObject(name, img, location, speed)
{
    this.name = name;
    this.img = img;
    this.location = location;
    this.x = 0;
    this.y = 0;
    this.speed = speed;
}

function bulletObject(name, img, speed, fired, location)
{
    this.name = name;
    this.img = img;
    this.speed = speed;
    this.fired = fired;
    this.location = location;
}




function pageLoaded()
{
    var url_string = window.location.href;
    var url = new URL(url_string);
    var username = url.searchParams.get("username");
    console.log(username);
    alert("Hello Commander " + username);
    gameLoop();
}

//Contains all objects for the game
//Player objects
var playerCannonWest = new GameObject("CannonWest", cannonImage, 100, 5);
playerCannonWest.x = 10;
playerCannonWest.y = 550;

var playerCannonNorth = new GameObject("CannonNorth", cannonImage, 100, 5);
playerCannonNorth.x = 200;
playerCannonNorth.y = 550;

var playerCannonEast = new GameObject("CannonEast", cannonImage, 100, 5);
playerCannonEast.x = 400;
playerCannonEast.y = 550;

var playerGameObjectsArray = [playerCannonWest, playerCannonNorth, playerCannonEast];

//Bullet Objects
var playerBullet = new bulletObject("Bullet", rocketImage, 1);

var playerBulletArray= [];
var playerBulletIndex = 0;

for (let index = 0; index < 15; index++) 
{
    playerBulletArray[index] = new bulletObject("Bullet", rocketImage, 1, false, cannonFireSound);
}

//Enemy Objects
var enemyTankArray = [];

for (let index = 0; index < 9; index++) 
{
    enemyTankArray[index] = new enemyObject("Tank", tankImage, 0, 0.1);
}

//Setting their spawns
for (let index = 0; index < enemyTankArray.length; index++) 
{
    var randomNumber = Math.floor(Math.random() * 3);
    enemyTankArray[index].location = randomNumber;
    enemyTankArray[index].x = playerGameObjectsArray[randomNumber].x + 30;
    enemyTankArray[index].y = -150 ;
    console.log("Tank Pos: " + enemyTankArray[index].x + ", " + enemyTankArray[index].y);
}


function draw()
{
    context.clearRect(0,0,1500,1500);
    
    drawHealthState();

    for (let index = 0; index < playerGameObjectsArray.length; index++) 
    {
        context.drawImage(playerGameObjectsArray[index].img, playerGameObjectsArray[index].x, playerGameObjectsArray[index].y);
    }

    for (let index = 0; index < playerBulletArray.length; index++) 
    {
        if (playerBulletArray[index].fired == true) 
        {
            context.drawImage(playerBulletArray[index].img, playerBulletArray[index].x, playerBulletArray[index].y);
        }
    }

    for (let index = 0; index < enemyTankArray.length; index++) 
    {  
        context.drawImage(enemyTankArray[index].img, enemyTankArray[index].x, enemyTankArray[index].y);

    }
}


  // Draw a HealthBar on Canvas, can be used to indicate players health
  function drawHealthState() 
  {
        for (let index = 0; index < playerGameObjectsArray.length; index++) 
        {
            if (playerGameObjectsArray[index].health >= 76) 
            {
                playerGameObjectsArray[index].img = cannonImage;
            }     
            if (playerGameObjectsArray[index].health >= 50 && playerGameObjectsArray[index].health <= 75) 
            {
                playerGameObjectsArray[index].img = cannonImageDamaged1;
            }
            if (playerGameObjectsArray[index].health >= 1 && playerGameObjectsArray[index].health <= 49) 
            {
                playerGameObjectsArray[index].img = cannonImageDamaged2;
            }
            if (playerGameObjectsArray[index].health == 0) 
            {
                playerGameObjectsArray[index].img = cannonImageDestroyed;
            }     

        }
  }

function updateScore()
{

    score = localStorage.getItem('score');

    if(isNaN(score))
    {
      localStorage.setItem('score', 0);
      document.getElementById("SCORE").innerHTML = "[" + score + "]";
      console.log(score);
    }
    else
    {
      localStorage.setItem('score', parseInt(score) + 1);
      document.getElementById("SCORE").innerHTML = "[" + score + "]";
      console.log(score);
    }

    score++;
    console.log("Score: " + score);

    resource++;
    console.log("Resouce: " + resource);

    showResources();
}

function loseState()
{
    if (playerCannonEast.health <= 0 & playerCannonNorth.health <= 0 & playerCannonWest.health <= 0 ) 
    {
        alert("Whelp you lost");
        gameRunning = false;
    }
}

function moveSprites()
{
    moveProjectile();
    moveEnemy();
}

function moveProjectile()
{
    for (let index = 0; index < playerBulletArray.length; index++) 
    {

        if (playerBulletArray[index].fired == true) 
        {
            playerBulletArray[index].y -= playerBulletArray[index].speed;
        }
        if (playerBulletArray[index].y < -100) 
        {
            playerBulletArray[index].fired = false;
            playerBulletArray[index].x = 10000;
            playerBulletArray[index].y = 10000;
        }
    }

}




function moveEnemy()
{
    for (let index = 0; index < enemyTankArray.length; index++) 
    {
        if (enemyTankArray[index].y < 450)
        {
            enemyTankArray[index].y = enemyTankArray[index].y + enemyTankArray[index].speed;
        }
    }

}

function takeDamage()
{
    for (let i = 0; i < enemyTankArray.length; i++) 
    {
        for (let j = 0; j < playerGameObjectsArray.length; j++)
        {
            if (enemyTankArray[i].y >= 450) 
            {

                playerGameObjectsArray[j].health -= 25;
                console.log(playerGameObjectsArray[j].name + " has been damaged: "+ playerGameObjectsArray[j].health);
                var randomNumber = Math.floor(Math.random() * 3);
                enemyTankArray[i].location = randomNumber;
                enemyTankArray[i].x = playerGameObjectsArray[randomNumber].x + 30;
                enemyTankArray[i].y = -150 ;
                drawHealthState();
            }

        }
    }
}


//Detects Collisions between projectile and enemy
function collisionDetection()
{

    var newPosX = 0;
    var newPosY = 0;

    for (let i = 0; i < enemyTankArray.length; i++) 
    {
        for (let j = 0; j < playerBulletArray.length; j++)
        {

            if (playerBulletArray[j].fired == true) 
            {

                if (enemyTankArray[i].location == playerBulletArray[j].location) 
                {
                    newPosX = playerBulletArray[j].x - enemyTankArray[i].x;
                    newPosY = playerBulletArray[j].y - enemyTankArray[i].y;

                    if (newPosX <= 10 && newPosY <= 10) 
                    {
                        console.log("Collision detected");
                        playerBulletArray[j].fired = false;
                        playerBulletArray[j].x = 10000;
                        playerBulletArray[j].y = 10000;

                        var randomNumber = Math.floor(Math.random() * 3);
                        enemyTankArray[i].location = randomNumber;
                        enemyTankArray[i].x = playerGameObjectsArray[randomNumber].x + 30;
                        enemyTankArray[i].y = -150 ;
                        updateScore();
                        enemyTankArray[i].speed += 0.01;
                    }
                }
            }
        }
    }
}


function buttonAttack(index)
{
    if (playerGameObjectsArray[index].ammo != 0) 
    {  

        if (playerBulletIndex <= 9) 
        {
            playerBulletArray[playerBulletIndex].fired = true;
            playerBulletArray[playerBulletIndex].x = playerGameObjectsArray[index].x + 30;
            playerBulletArray[playerBulletIndex].y = playerGameObjectsArray[index].y - 30;
            playerBulletArray[playerBulletIndex].location = index;
            playerBulletIndex++;
            playerGameObjectsArray[index].ammo--;
            cannonFireSound.play();
            showAmmo();
        }
        else
        {
            playerBulletIndex = 0;
            playerBulletArray[playerBulletIndex].fired = true;
            playerBulletArray[playerBulletIndex].x = playerGameObjectsArray[index].x + 30;
            playerBulletArray[playerBulletIndex].y = playerGameObjectsArray[index].y - 30;
            playerBulletArray[playerBulletIndex].location = index;
            playerGameObjectsArray[index].ammo--;
            cannonFireSound.play();
            showAmmo();
        }
        console.log("We fired one round against the enemy: " + playerGameObjectsArray[index].ammo);
    }
    else
    {
        console.log("SIR WE'RE OUT OF AMMO IN THE CANNON!");
    }
}

function buttonRepair(index)
{
    if(supplies != 0)
    {
        playerGameObjectsArray[index].health += 25;
        supplies--;
        console.log(playerGameObjectsArray[index].health);
        showSupply();
    }
    else
    {
        console.log("SIR WE'RE OUT OF SPARE PARTS!");
    }
}

function buttonReload(index)
{
    if(ammunition != 0)
    {
        playerGameObjectsArray[index].ammo = playerGameObjectsArray[index].ammo + 1;
        ammunition--;
        console.log("Reloaded" + playerGameObjectsArray[index].ammo);
        showAmmo();
    }
    else
    {
        console.log("SIR WE'RE OUT OF AMMO!");
    }
}


function showResources()
{
    document.getElementById("RESOURCES").innerHTML = "[" + resource + "]";
}

function showAmmo()
{
    document.getElementById("AMMO").innerHTML = "[" + ammunition + "]";
}

function showSupply()
{
    document.getElementById("SUPPLY").innerHTML = "[" + supplies + "]";
}


function buyAmmo()
{
    if (resource >= 2) 
    {
        ammunition++;
        resource -=2;
        showResources();
    }
    else
    {
        console.log("No resources");
    }
}


function buyRepairKit()
{
    if (resource >= 2) 
    {
        supplies++;
        resource -=2;
        showResources();
    }
    else
    {
        console.log("No resources");
    }

}

function gameLoop()
{

    if (gameRunning == true) 
    {
        draw();
        moveSprites();
        collisionDetection();
        takeDamage();
        window.requestAnimationFrame(gameLoop);  
        loseState();
    }

}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameLoop);