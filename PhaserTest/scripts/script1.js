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
    player;

function create() {
    createWorld();
    createPlatforms();
    createPlayer();
}
var controller;
function update() {
    createController();
    playerUpdate();
    cameraUpdate();
    console.log(player.x);
}

function createWorld(){

    //worldSize
    game.world.setBounds(0, 0, 2400, 600);

    //Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //BackGround
    background = game.add.sprite(0, 0, 'sky');
    background.scale.setTo(3,1);

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

    //addPlatforms: to be implemented


}
function createPlayer(){
    //sprite: placeHolder
    player = game.add.sprite(200, game.world.height - 150, 'dude');
    //physics
    game.physics.arcade.enable(player);
    //gravity
    player.body.gravity.y = 400;
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
    player.body.velocity.x=0;
    //movement left/right
    if (controller.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;

        // player.animations.play('left');
        player.animations.play('left');
    }  else if (controller.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        //player.animations.play('john-right');
    }  else  {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
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
}