/* Extensions used are sound and platforms
Platform and character die part was a bit difficult 
*/

/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isInCanyon;
var isOnPlatform;

var clouds;
var mountains;
var trees;
var canyon;
var collectable;

var game_score;
var startFlagPole;
var flagpole;
var lives;
var platform;

var gameOver;
var marioDies;
var worldClear;
var marioJump;
var coinSound
var backgroundSound;

var a=0;
var b=0;
var c=0;

function preload(){
	soundFormats('mp3','wav',);

	// sounds

	gameOver = loadSound('music/gameover.wav');
	marioDies = loadSound('music/mariodie.wav');
	worldClear = loadSound('music/worldclear.wav');
	marioJump = loadSound('music/jump.wav');
	coinSound = loadSound('music/coin.wav');	
	backgroundSound = loadSound('music/backgroundsound.mp3');
	backgroundSound.setVolume(0.2)

}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	
	lives = 3;
	
	startGame()
	
	
}

function draw()
{
	checkPlayerDie();	
	background(100, 155, 255); // fill the sky blue
	
	// draw some green ground

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 

	push();
	translate(scrollPos,0);
	


	// Draw clouds.
	drawClouds()

	// Draw mountains.
	drawMountains()

	// Draw trees.
	drawTress()

	// Draw canyons.
	for(var i=0;i<canyon.length;i++){
			drawCanyon(canyon[i]);
			checkCanyon(canyon[i]);
		}
	

	// Draw collectable items.
	for(var i=0;i<collectable.length;i++){
		if(!collectable[i].isFound){
			drawCollectable(collectable[i]);
			checkCollectable(collectable[i]);
		}
	}
	// draw flag

	startflag(startFlagPole);

	endflag(flagpole);

	checkFlag(flagpole);

	//draw platforms

	platforms(platform);

	// Draw game character.
	
	pop();
	drawGameChar();
	// Draw Score

	fill(255);
	textSize(12);
	text('score :'+game_score,20,20);

	// Draw lives
	textSize(12);
	text('lives :'+lives,20,40);
	
	
	// game over and game complete logic
	if(lives==0){
		fill(255,0,0);
		textSize(50);	
		text('GAME OVER',width/2-150,height/2,500,500);
		if(backgroundSound.isPlaying()){
			backgroundSound.pause()
		}
		if(a==0){
			gameOver.loop()
		}
		a+=1
	}

	else if(flagpole.isReached){
		fill(255,0,0);
		textSize(50);
		text('level complete',width/2,height/2,500,500);
		if(backgroundSound.isPlaying){
			backgroundSound.pause();
			if(c==0){
				worldClear.loop()
			}
		c+=1

		}
	}

	else if(lives>0){
		// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if(gameChar_y<floorPos_y){
		if(checkPlatform(platform)){
			isFalling=false;
		}
		else{
			gameChar_y+=2;
			isFalling=true;
	}
	}
	else{
		isFalling=false;
	}

	if(isPlummeting){
		gameChar_y+=5;
	}

	if(isInCanyon){
		if(a==0){
			marioDies.play();
		}
		a+=1
		gameChar_y+=5;
		isLeft=false;
		isRight=false;
		if(gameChar_y>height){
			isInCanyon=false;
			a=0;	
		}
	}



	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

}	
	}
	


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	if(!isInCanyon && lives>0 && !flagpole.isReached){
		if (keyCode==37 || key=='A'){
			isLeft=true;
			if(!backgroundSound.isPlaying()){
				backgroundSound.loop();
			}
		}
		if (keyCode==39 || key=='D') {
			isRight=true;
			if(!backgroundSound.isPlaying()){
				backgroundSound.loop();
			}
		}
		if (keyCode==32 || key=='W') {
			if(!isFalling){
				gameChar_y-=100;
				marioJump.play();
				if(!backgroundSound.isPlaying()){
				backgroundSound.loop();
			}	
		}
	}
}
}

function keyReleased()
{
	if(!isInCanyon && lives>0){
		if (keyCode==37 || key=='A') {
			isLeft=false;
		}
		if (keyCode==39 || key=='D') {
			isRight=false;
		}
		if (keyCode==32 || key=='W') {
			isPlummeting=false;
			if(gameChar_y<=floorPos_y){
				isFalling=true;
			}
		}
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character

	if(isLeft && isFalling)
	{	
		// add your jumping-left code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57,8,10);
		fill(215, 0, 64);
		rect(gameChar_x-3,gameChar_y-50,6,25);
		fill(165, 42, 42);
		rect(gameChar_x,gameChar_y-25,3,18);
		stroke(0,0,0);
		strokeWeight(.5);
		rect(gameChar_x-3,gameChar_y-25,3,9);
		noStroke();
		fill(232, 190, 172);
		rect(gameChar_x-9,gameChar_y-46,6,3);
		rect(gameChar_x,gameChar_y-46,10,3);
		

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57,8,10);
		fill(215, 0, 64);
		rect(gameChar_x-3,gameChar_y-50,6,25);
		fill(165, 42, 42);
		rect(gameChar_x-3,gameChar_y-25,3,18);
		stroke(0,0,0);
		strokeWeight(.5);
		rect(gameChar_x,gameChar_y-25,3,9);
		noStroke();
		fill(232, 190, 172);
		rect(gameChar_x+3,gameChar_y-46,6,3);
		rect(gameChar_x-10,gameChar_y-46,10,3);

		

	}
	else if(isLeft)
	{
		// add your walking left code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57+5,8,10);
		fill(215, 0, 64);
		rect(gameChar_x-3,gameChar_y-50+5,6,25);
		fill(165, 42, 42);
		rect(gameChar_x,gameChar_y-25+5,3,20);
		stroke(0,0,0);
		strokeWeight(.5);
		rect(gameChar_x-3,gameChar_y-25+5,3,20);
		noStroke();
		fill(232, 190, 172);
		rect(gameChar_x-13,gameChar_y-46+5,10,3);
		rect(gameChar_x,gameChar_y-46+5,3,10);
		
	}
	else if(isRight)
	{
		// add your walking right code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57+5,8,10);
		fill(215, 0, 64);
		rect(gameChar_x-3,gameChar_y-50+5,6,25);
		fill(165, 42, 42);
		rect(gameChar_x-3,gameChar_y-25+5,3,20);
		stroke(0,0,0);
		strokeWeight(.5);
		rect(gameChar_x,gameChar_y-25+5,3,20);
		noStroke();
		fill(232, 190, 172);
		rect(gameChar_x+3,gameChar_y-46+5,10,3);
		rect(gameChar_x-3,gameChar_y-46+5,3,10);

		

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57,10,10);
		fill(215, 0, 64);
		rect(gameChar_x-8,gameChar_y-50,16,25);
		fill(165, 42, 42);
		rect(gameChar_x-7,gameChar_y-25,3,18);
		rect(gameChar_x+4,gameChar_y-25,3,8);
		fill(232, 190, 172);
		rect(gameChar_x-18,gameChar_y-46,10,3);
		rect(gameChar_x+8,gameChar_y-46,10,3);
		
		

	}
	else
	{
		// add your standing front facing code
		fill(232, 190, 172);
		ellipse(gameChar_x,gameChar_y-57+5,10,10);
		fill(215, 0, 64);
		rect(gameChar_x-8,gameChar_y-50+5,16,25);
		fill(165, 42, 42);
		rect(gameChar_x-7,gameChar_y-25+5,3,20);
		rect(gameChar_x+4,gameChar_y-25+5,3,20);
		fill(232, 190, 172);
		rect(gameChar_x-18,gameChar_y-46+5,10,3);
		rect(gameChar_x+8,gameChar_y-46+5,10,3);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
	for(var i=0;i<clouds.length;i++){
		fill(255,2255,255);
		ellipse((clouds[i]).posx+100,(clouds[i]).posy+50,200,70);
		ellipse((clouds[i]).posx+120,(clouds[i]).posy+30,100,100);
		ellipse((clouds[i]).posx+200,(clouds[i]).posy+30,70,70);
	}
}

// Function to draw mountains objects.
function drawMountains(){
	for(var i=0;i<mountains.x_pos.length;i++){
		stroke(color(0,0,0));
		strokeWeight(.5);
		fill(38, 64, 71);
		triangle(mountains.x_pos[i]+100,floorPos_y,mountains.x_pos[i]+300,floorPos_y,mountains.x_pos[i]+200,mountains.y_pos+200);
		triangle(mountains.x_pos[i]-100,floorPos_y,mountains.x_pos[i]+100,floorPos_y,mountains.x_pos[i],mountains.y_pos+250);
		triangle(mountains.x_pos[i],floorPos_y,mountains.x_pos[i]+200,floorPos_y,mountains.x_pos[i]+100,mountains.y_pos+150);
		
	}
}

// Function to draw trees objects.
function drawTress(){
	for(var i=0;i<trees.treePos_x.length;i++){
		stroke(color(0,0,0));
		strokeWeight(.5);
		fill(222, 111, 27);
		rect(trees.treePos_x[i]-450,trees.treePos_y+50,40,100)
		fill(34,139,34);
		triangle(trees.treePos_x[i]-450-20,trees.treePos_y+50,trees.treePos_x[i]-450+60,trees.treePos_y+50,trees.treePos_x[i]-450+20,trees.treePos_y+50-30);
		triangle(trees.treePos_x[i]-450-15,trees.treePos_y+50-20,trees.treePos_x[i]-450+60-5,trees.treePos_y+50-20,trees.treePos_x[i]-450+20,trees.treePos_y+50-30-20);
	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	stroke(color(0,0,0));
	strokeWeight(.5);
	fill(33, 12, 10);
	rect(t_canyon.x_pos,floorPos_y,t_canyon.width,height-floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if(gameChar_world_x>t_canyon.x_pos && gameChar_world_x<t_canyon.x_pos+t_canyon.width && gameChar_y==floorPos_y){
		isInCanyon=true;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
	stroke(color(0,0,0));
	strokeWeight(.5);
	fill(255,215,0);
	ellipse(t_collectable.x_pos,t_collectable.y_pos,20,20);
	ellipse(t_collectable.x_pos,t_collectable.y_pos,15,15);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x,gameChar_y-20,t_collectable.x_pos,t_collectable.y_pos)<30){
		t_collectable.isFound=true;
		game_score+=1;
		coinSound.play();
	}
}


// render flag

function startflag(pole){

	fill(255,215,0);
	rect(pole.x_pos,pole.y_pos,pole.width,pole.height);
	fill(0,128,0);
	triangle(pole.x_pos+5,pole.y_pos,pole.x_pos+5,pole.y_pos+100,pole.x_pos+70,pole.y_pos+50);

}


function endflag(pole){
	fill(255,215,0);
	rect(pole.x_pos,pole.y_pos,pole.width,pole.height);
	fill(0,128,0);
	triangle(pole.x_pos+5,pole.y_pos,pole.x_pos+5,pole.y_pos+50,pole.x_pos+70,pole.y_pos+25)
}

// function to check is chacter is in contact to flag

function checkFlag(pole){
	if (abs(gameChar_world_x-pole.x_pos)<=5	 && (pole.y_pos+100==gameChar_y)){
		pole.isReached=true;
	}
}
// Function to check character has died.

function checkPlayerDie(){
	if(lives>0){
		if(gameChar_y>height){
			lives-=1
			gameChar_y=floorPos_y-100;
			gameChar_x=100;
		}
	}
	else if(lives==0){
		gameChar_x=100;
		gameChar_y=floorPos_y;
	}
		
	
	
}

// function to draw platforms

function platforms(t_platform){
	for(var i=0;i<t_platform.length;i++){
		rect(t_platform[i].x_pos,t_platform[i].y_pos,100,5);
	}
}

//Function to check is character is on platform
function checkPlatform(t_platform){
	for(var i=0;i<t_platform.length;i++){
		if(gameChar_y==t_platform[i].y_pos && gameChar_world_x>=t_platform[i].x_pos && gameChar_world_x<=t_platform[i].x_pos+100){
			return true
		}
	}
}

//Function StartGame.
function startGame(){
	gameChar_x = 100;
	gameChar_y = floorPos_y;
	
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isInCanyon = false;
	isOnPlatform = false;

	// Initialise arrays of scenery objects.
	trees = { treePos_x:[0,100,500,900,1300,1700], treePos_y:height/2};
	clouds = [{posx:200,posy:50},{posx:600,posy:100},{posx:900,posy:200},{posx:1600,posy:100}];
	mountains =  {x_pos: [0,600,1200,1700], y_pos:100};
	canyon = [{x_pos:200,width:700},{x_pos:1000,width:100},{x_pos:1000,width:100},{x_pos:1200,width:100}];	
	collectable = [{x_pos:350,y_pos:350,isFound:false},{x_pos:650,y_pos:350,isFound:false},{x_pos:1350,y_pos:250,isFound:false},{x_pos:1450,y_pos:170,isFound:false}];
	startFlagPole = {x_pos:50,y_pos:floorPos_y-400,width:5,height:400};

	game_score = 0;
	flagpole = {x_pos:1500,y_pos:90,width:5,height:100,isReached:false};
	platform = [
		{x_pos:300,y_pos:400},
		{x_pos:450,y_pos:350},
		{x_pos:600,y_pos:400},
		{x_pos:1000,y_pos:400},
		{x_pos:1150,y_pos:330},
		{x_pos:1300,y_pos:260},
		{x_pos:1450,y_pos:190}
	]
}