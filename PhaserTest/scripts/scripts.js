/**
 * Created by ArgiDux on 7/21/2015.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('firstaid','assets/firstaid.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('john-left', 'assets/john-left.png',175,230);
}
var platforms;
var diamonds;
var player;
var stars;
var time;
var timeText;
var explosion;

function create() {

    game.world.setBounds(0, 0, 1200, 600);
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.camera.x=100;
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(4, 4);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;


    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('john-left', [0,1,2],10,true);

    stars = game.add.group();
    diamonds =game.add.group();
    diamonds.enableBody=true;
    stars.enableBody = true;
    explosion=game.add.group();
    explosion.enableBody=true;
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 126;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.5 + Math.random() * 0.2;
    }
    stars.children[5].position.y=100;
    timeText = game.add.text(16, 16, 'time: 0', { fontSize: '32px', fill: '#000' });
    time=game.time.now;
}
var canJump=true;
var lastFireTime=0;
var dif=0.5;
var currentTIme;
function update() {
    currentTIme=game.time.totalElapsedSeconds();


    //player.pivotA=1;
    var cursors = game.input.keyboard.createCursorKeys();
    var fireKey=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;

       // player.animations.play('left');
        player.animations.play('john-left');
    }  else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        //player.animations.play('john-right');
    }  else  {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    if(player.body.touching.down && !cursors.up.isDown){
        canJump=true;
    }
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && canJump) {
        player.body.velocity.y = -350;
        canJump=false;

    }
    if (fireKey.isDown && player.body.touching.down) {
        if(lastFireTime+dif<currentTIme) {
            fire(player);
            lastFireTime=currentTIme;
        }
    }
    //player.fixedToCamera=true;
   // game.camera.x=player.x;
    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(diamonds, stars, collectStar, null, this);
    checkForExpire();

    timeText.text = 'Time: ' + game.time.totalElapsedSeconds().toPrecision(3);
}
function fire(player){
    var diamond=diamonds.create(player.x,player.y,'diamond');
    diamond.body.velocity.y=-100;
}
function collectStar (diamond, star) {

    CreatExplosion(star.x,star.y);
    // Removes the star from the screen
    star.kill();
    diamond.kill();



}
function CreatExplosion(positionX,positionY){
    var explode=diamonds.create(positionX,positionY,'firstaid');
    explode.birth=currentTIme;
    console.log(explode);

}
function checkForExpire(){
    var collection=diamonds.children;
    for(var i in collection){
        if(collection[i].birth+10>=currentTIme){
            collection[i].kill();
        }
    }
}