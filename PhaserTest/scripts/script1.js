/**
 * Created by ArgiDux on 7/23/2015.
 */
/**
 * Created by ArgiDux on 7/21/2015.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var SCREENSIZE=800;
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('firstaid','assets/firstaid.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('john-left', 'assets/john-left.png',175,230);
}

var platforms,
    background,
    player,
    velocityScale=175;;

function create() {
    createWorld();
    createPlatforms();
    createPlayer();
}
var controller,
    canJump=true;
function update() {
    createController();
    playerUpdate();
    cameraUpdate();
    console.log(player.body.gravity.y);
}

function createWorld(){

    //worldSize
    game.world.setBounds(0, 0, 2400, 900);

    //Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //BackGround
    background = game.add.sprite(0, 0, 'sky');
    background.scale.setTo(3,1.5);

    //PlaceHolder

}

function createPlatforms(){
    //create platform groups

    //create group
    platforms = game.add.group();

    //add physics
    platforms.enableBody = true;

    //addGround
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(6, 2);
    ground.body.immovable = true;
    SegmentOne();
    //addPlatforms: to be implemented


}
function SegmentOne(){
    var ledge1 = platforms.create(400, 900 - 200, 'ground');
    ledge1.body.immovable = true;

    var ledge2 = platforms.create(600, 900 - 350, 'ground');
    ledge2.body.immovable = true;
    ledge2.scale.setTo(0.5,1);

    var ledge3 = platforms.create(0, 900 - 400, 'ground');
    ledge3.body.immovable = true;

    var ledge4 = platforms.create(500, 900 - 550, 'ground');
    ledge4.body.immovable = true;
    ledge4.scale.setTo(0.75,1);

    var wall1 = platforms.create(650, 900 - 550, 'ground');
    wall1.body.immovable = true;
    wall1.scale.setTo(0.2,0.5);
    wall1.angle=270;
}
function createPlayer(){
    //sprite: placeHolder
    player = game.add.sprite(200, game.world.height - 150, 'dude');
    //physics
    game.physics.arcade.enable(player);
    //gravity
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //animation: placeHolder
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}
function createController(){
    controller=game.input.keyboard.createCursorKeys();
    controller.fire=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
function playerUpdate(){
    //collide with ground and platforms
    game.physics.arcade.collide(player, platforms);
    //retain speed in air or make it 0 when touching ground
    if(player.body.touching.down){
        player.body.velocity.x=0;
        player.body.gravity.x=0;
        //player.body.gravity.y=500

    }

    //movement left/right
    if (controller.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -velocityScale;

        player.animations.play('left');
    }  else if (controller.right.isDown) {
        //  Move to the right
        player.body.velocity.x = velocityScale;

        player.animations.play('right');
    }  else  {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    //movement jump
    //prevent continuous jumping
    if(player.body.touching.down && !controller.up.isDown){
        canJump=true;
    }
    //  Allow the player to jump if they are touching the ground.
    if (controller.up.isDown && player.body.touching.down && canJump) {
        player.body.velocity.y = -350;
        canJump=false;

    }
    if (controller.up.isDown) {
       player.body.gravity.y=300;
    } else {
        player.body.gravity.y=500;
    }
    //resistance in x
    var speed= Math.abs(player.body.velocity.x);
    if(speed>0){
        player.body.gravity.x= (speed/player.body.velocity.x)*25*-1;
    }

}
function cameraUpdate(){

    //keeps in the middle of the screen always
    if(game.camera.x<SCREENSIZE/2){
        game.camera.x=0;
    }//left most camera
    if(game.camera.x>SCREENSIZE*3 - SCREENSIZE/2){
        game.camera.x=SCREENSIZE*3 - SCREENSIZE/2;
    }//right most camera
    game.camera.x=player.x - SCREENSIZE/2;
    game.camera.y=player.y - 300;
}