// after some win/loose condition is fulfilled game is destroyed and Menu is called again
// Example:
// if (winLooseCondition) {
//  game.destroy();
//  Menu();
// }
// Remark: this code produces TypeError in browser: Cannot read property 'keyboard' of null
//  still, it works

var Play = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var SCREENSIZE=800;
    function preload() {
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('diamond', 'assets/diamond.png');
        game.load.image('firstaid','assets/firstaid.png');
        game.load.image('background','assets/background-new.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('john', 'assets/john-short-new-jumpAdded.png', 158.5, 225);
        game.load.spritesheet('robot', 'assets/robot.png', 96, 202);
        game.load.spritesheet('border', 'assets/border-block.png', 22, 32);
    }

    var worldHeight = 900,
        platforms,
        background,
        player,
        bonus,
        bots,
        bot,
        velocityScale=175,
        bullets,
        lives,
        botBoundaries;

    function create() {
        createWorld();
        createPlatforms();
        createPlayer();
        createBonus();
        createBullets();
        createHearts();
        drawHearts();
        createBot(550,900-650);
    }
    var controller,
        canJump=true;
    function update() {
        var oldLives=player.lives;
        createController();
        playerUpdate();
        botsUpdate();
        cameraUpdate();
        playerCollision();
        bulletsUpdate();
       if(player.lives!==oldLives){
            destroyGroup(lives);
            drawHearts();
        }
        //console.log(player.body.gravity.y);
    }
    function destroyGroup(group){
        for(var i in group.children){
            group.children[i].kill();
        }
    }
    function createWorld(){

        //worldSize
        game.world.setBounds(0, 0, 2400, worldHeight);

        //Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //BackGround
        background = game.add.sprite(0, 0, 'background');
        background.scale.setTo(3,1.1);
        background.alpha=1;

        //PlaceHolder

    }

    function createPlatforms(){
        //create platform groups

        //create group
        platforms = game.add.group();
        botBoundaries =game.add.group();

        //add physics
        platforms.enableBody = true;
        botBoundaries.enableBody=true;

        //addGround
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(6, 2);
        ground.body.immovable = true;
        SegmentOne();
        //addPlatforms: to be implemented


    }

    function createBonus(){
        bonus = game.add.group();
        bonus.enableBody=true;

        var codeBonus=bonus.create(700,900 - 600,'star');

    }

    function createBullets(){
        bullets=game.add.group();
        bullets.enableBody=true;
    }

    function bullet(){
        var bullet=bullets.create(player.x+30*player.lastDirection,player.y+30,'star');
        game.physics.arcade.enable(bullet);
        bullet.body.velocity.x=300*player.lastDirection;
        player.lives -=1;

        //return bullet;
    }


    function SegmentOne(){
        createLedgeWithBorders(400, 900 - 200);
        createLedgeWithBorders(600, 900 - 350, 0.5, 1);
        createLedgeWithBorders(0, 900 - 400);
        createLedgeWithBorders(500, 900 - 550, 0.75, 1);
    }

    function createLedgeWithBorders(ledgeX, ledgeY, scaleX, scaleY) {
        var platformOriginalWidth = 400,
            platformOriginalHeight = 32,
            borderOriginalWidth = 22,
            scaleX = scaleX || 1,
            scaleY = scaleY || 1,
            ledge,
            ledgeWidth,
            ledgeHeight,
            borderLeft,
            borderRight,
            borderY;

        ledge = platforms.create(ledgeX, ledgeY, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(scaleX,scaleY);

        ledgeWidth = platformOriginalWidth * scaleX;
        ledgeHeight = platformOriginalHeight * scaleY;

        borderY = ledgeY - ledgeHeight;

        borderLeft=botBoundaries.create(ledgeX - borderOriginalWidth, borderY,'border');
        borderLeft.body.immovable = true;
        borderLeft.renderable = false;

        borderRight = botBoundaries.create(ledgeX + ledgeWidth, borderY, 'border');
        borderRight.body.immovable = true;
        borderRight.renderable = false;
    }

    function createPlayer(){
        //sprite: placeHolder
        player = game.add.sprite(200, game.world.height - 150, 'john');
        //physics
        game.physics.arcade.enable(player);
        game.physics.arcade.collide(player, platforms);
        //gravity
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;

        //animation: placeHolder
        player.animations.add('right', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 35, true);
        player.animations.add('left', [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14], 35, true);
        player.animations.add('faceRight', [0], 10, true);
        player.animations.add('faceLeft', [27], 10, true);
        player.animations.add('faceRightJump', [28], 10, true);
        player.animations.add('faceLeftJump', [29], 10, true);
        // additional attrbutes
        player.scale.setTo(0.25);
        player.lives=3;
        player.score=0;
        player.lastDirection=1; //right

    }

    function createBot(x,y){
        if(!bots){
            createBots();
        }
        bot = game.add.sprite(x, y, 'robot');

        game.physics.arcade.enable(bot);
        //game.physics.arcade.collide(bot, platforms);
        bot.body.gravity.y = 500;
        bot.animations.add('left',[13, 12, 11, 10, 9], 10, true);
        bot.animations.add('right',[1, 2, 3, 4, 5, 6], 10, true);
        bot.scale.setTo(0.3, 0.28);
        // bot.size=32;
        bot.direction = 1;
        bots.add(bot);

    }

    function createBots(){
        bots=game.add.group();
        bots.enableBody=true;
    }

    function createHearts(){
        lives=game.add.group();
        lives.enableBody=true;

    }
    function drawHearts(){
        for(var i= 0; i<player.lives; i+=1){
            var obj=lives.create(i*50, 20, 'firstaid');
            obj.fixedToCamera=true;
        }
    }

    function createController(){
        controller=game.input.keyboard.createCursorKeys();
        controller.fire=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    var timer=0;
    var reload=5;
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
            //console.log(player.lastDirection);
            player.animations.play('left');
            player.lastDirection=-1;
        }
        else if (controller.right.isDown ) {
            //  Move to the right
            player.body.velocity.x = velocityScale;
            player.animations.play('right');
            player.lastDirection=1;
        }  else  {
            //  Stand still

            if(player.lastDirection==1) {
                player.animations.play('faceRight');
            }else{
                player.animations.play('faceLeft');
            }
        }

        if(controller.fire.isDown && timer>=10){
            bullet();
            timer=0;
        }
        timer +=1;
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
            player.body.gravity.y=700;
        }
        if(!player.body.touching.down){
            if(player.lastDirection==1) {
                player.animations.play('faceRightJump');
            }else{
                player.animations.play('faceLeftJump');
            }
        }
        //resistance in x
        var speed= Math.abs(player.body.velocity.x);
        if(speed>0){
            player.body.gravity.x= (speed/player.body.velocity.x)*25*-1;
        }

    }

    function botsUpdate(){
        game.physics.arcade.collide(bots, platforms);
        game.physics.arcade.collide(botBoundaries, bots);
        for(var i in bots.children){
            botUpdate(bots.children[i]);
        }
    }

    function bulletsUpdate(){
        game.physics.arcade.collide(bullets,platforms);
        game.physics.arcade.overlap(bullets, bots, hitBot, null, this);
        game.physics.arcade.overlap(platforms, bots, hitWall, null, this);
        for(var i in bullets.children){
           if(bullets.children[i].body.touching.left || bullets.children[i].body.touching.right ){
               bullets.children[i].kill();
           }
        }
    }

    function botUpdate(bot){
        //check for ledge

        if(bot.body.touching.left){
            bot.direction *=-1;
        }
        if(bot.body.touching.right){
            bot.direction *=-1;
        }
        //movement
        bot.body.velocity.x= velocityScale*bot.direction;
        if(bot.body.velocity.x<=0){
            bot.animations.play('left');
        } else{
            bot.animations.play('right');
        }



    }

    function playerCollision(){
        game.physics.arcade.collide(bonus, platforms);
        game.physics.arcade.overlap(player, bonus, collect, null, this);
        game.physics.arcade.overlap(player, bots, die, null, this);

    }

    function collect(player,bon){
        bon.kill();
        player.score +=10;
        //console.log(player.score);
    }

    function hitBot(bullet,bot){
        bullet.kill();
        bot.kill();
        player.score +=10;
        //console.log(player.score);
    }

    function hitWall(bullet,plat){
        bullet.kill();
        //console.log(player.score);
    }


    function die(player,bot){
        player.kill();
        player.score +=10;
        //console.log(player.score);
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
}
