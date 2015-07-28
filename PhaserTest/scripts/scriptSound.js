// after some win/loose condition is fulfilled game is destroyed and Menu is called again
// Example:
// if (winLooseCondition) {
//  game.destroy();
//  Menu();
// }
// Remark: this code produces TypeError in browser: Cannot read property 'keyboard' of null
//  still, it works

var Play1 = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });
    var gameGroupWithPhysics={
        add: function(groupName){
            this[groupName]=game.add.group();
            this[groupName].enableBody=true;
        }
    };
    var SCREENSIZE = 800;

    function preload() {
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('shot', 'assets/bolt-fliped.png');
        game.load.image('ammo', 'assets/bolt.png');
        game.load.image('key', 'assets/js1.png');
        game.load.image('diamond', 'assets/diamond.png');
        game.load.image('turret', 'assets/turret.png');
        game.load.image('spike', 'assets/spikeplz.png');
        game.load.image('firstaid', 'assets/firstaid.png');
        game.load.image('background', 'assets/background-new.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('john', 'assets/john-short-new-jumpAdded.png', 158.5, 225);
        game.load.spritesheet('robot', 'assets/robot.png', 96, 202);
        game.load.spritesheet('border', 'assets/border-block.png', 22, 32);
       /* game.load.audio('jump', 'assets/audio/spaceman.wav');
        game.load.audio('fire', 'assets/audio/pistol.wav');
        game.load.audio('bothit', 'assets/audio/sentry_explode.wav');
        game.load.audio('theme', 'assets/audio/HonkyTonkVillai2.ogg');
        game.load.audio('pickup', 'assets/audio/p-ping.mp3');
        game.load.audio('playerdeath', 'assets/audio/player_death.wav');
        game.load.audio('step', 'assets/audio/0085-1.ogg');
        game.load.audio('playerhit', 'assets/audio/player_hit.wav');*/
    }

    var worldHeight = 900,
        platforms,
        background,
        player,
        velocityScale = 175,
        jumpSound,
        fireSound,
        botHitSound,
        themeSound,
        pickupSound,
        playerDeathSound,
        stepSound,
        //spikes,
        playerHitSound,
        turret;

    function create() {
        createWorld();
        createAllGroups();
        createPlatforms();
        createPlayer();
        drawHearts();
        drawAmmo();
        createBots();
        createSounds();
        createSpikes();
        createBonusTokens();
        createTurret();
        gameGroupWithPhysics.add('Jimmy');
    }
    var controller,
        canJump = true;

    function update() {
        var oldLives = player.lives;
        var oldAmmo = player.ammo;
        createController();
        playerUpdate();
        botsUpdate();
        cameraUpdate();
        playerCollision();
        bulletsUpdate();
        turretUpdate();
        if (player.lives !== oldLives) {
            destroyGroup(gameGroupWithPhysics.lives);
            drawHearts();
        }
        if (player.ammo !== oldAmmo) {
            destroyGroup(gameGroupWithPhysics.playerAmmo);
            drawAmmo();
        }
        if (player.alive && player.lives <= 0) {
            player.kill();
            playerDeathSound.play();
            game.destroy();
        }
       // console.log(player.x);
        //console.log(
        // player.body.gravity.y);
    }



    /*Group Management*/
    function createAllGroups() {
        gameGroupWithPhysics.add('platforms');
        gameGroupWithPhysics.add('botBoundaries');
        gameGroupWithPhysics.add('bonus');
        gameGroupWithPhysics.add('bullets');
        gameGroupWithPhysics.add('bots');
        gameGroupWithPhysics.add('lives');
        gameGroupWithPhysics.add('playerAmmo');
        gameGroupWithPhysics.add('spikes');
    }
    function destroyGroup(group) {
        for (var i in group.children) {
            group.children[i].kill();
        }
    }

    /*Populating game world*/
    function createBots() {
        var dir;
        for (var i = 0; i < 9; i += 1) {
            dir = Math.random() >= 0.5 ? 1 : -1
            createBot(800 + i * 80, 700, dir);
        }
        createBot(550, 900 - 650, 1);

    }
    function createWorld() {

        //worldSize
        game.world.setBounds(0, 0, 3200, worldHeight);

        //Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //BackGround
        background = game.add.sprite(0, 0, 'background');
        background.scale.setTo(3, 1.1);
        background.alpha = 1;

        //PlaceHolder
    }
    function SegmentOne() {
        createLedgeWithBorders(400, 900 - 200);
        createLedgeWithBorders(600, 900 - 350, 0.5, 1);
        createLedgeWithBorders(0, 900 - 400);
        createLedgeWithBorders(500, 900 - 550, 0.75, 1);
    }
    function SegmentTwo() {
        createLedgeWithBorders(800, 850, 2, 1);

    }
    function SegmentThree() {
        createLedge(1700,700,0.2,0.4);
        createLedge(1750,500,0.2,0.4);
        createLedge(1900,600,0.2,0.4);
        createLedge(1900,300,0.2,0.4);
        createLedge(2000,450,0.4,0.4);
        createLedge(2400,700,0.4,0.4);

    }
    function createPlatforms() {

        //addGround
        var ground =  gameGroupWithPhysics.platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(8, 2);
        ground.body.immovable = true;
        SegmentOne();
        SegmentTwo();
        SegmentThree();
        //addPlatforms: to be implemented


    }
    function createBonusTokens(){
        var codeBonus1 = gameGroupWithPhysics.bonus.create(700, 900 - 600, 'key');
        var codeBonus2 = gameGroupWithPhysics.bonus.create(1200, 800, 'key');
        var codeBonus3 = gameGroupWithPhysics.bonus.create(1920, 250, 'key');
    }
    function createSounds() {
        jumpSound = game.add.audio('jump');
        fireSound = game.add.audio('fire');
        botHitSound = game.add.audio('bothit');
        pickupSound = game.add.audio('pickup');
        playerDeathSound = game.add.audio('playerdeath');
        themeSound = game.add.audio('theme');
        stepSound = game.add.audio('step');
        stepSound.volume = 0.5;
        playerHitSound = game.add.audio('playerhit');
        themeSound.loopFull();
    }
    function createSpikes(){
        var spike;
        for(var i=0; i<15; i+=1){
            spike=gameGroupWithPhysics.spikes.create(1700+i*50, 800, 'spike');
        }
    }
    function createPlayer() {
        //sprite: placeHolder
        player = game.add.sprite(200, game.world.height - 150, 'john');
        //physics
        game.physics.arcade.enable(player);

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
        player.lives = 3;
        player.score = 0;
        player.bonusCount=0;
        player.lastDirection = 1; //right
        player.ammo = 5;
        player.timeOfLastHit = game.time.totalElapsedSeconds();
        player.immortalTime = 1.5;
        player.canBeHurt = true; // test value

    }
    function createTurret(){
        turret=game.add.sprite(3000,700,'turret');
        turret.scale.setTo(0.5);
        turret.angle=30;
        turret.reloadTime=2;
        turret.timeOfLastShot= game.time.totalElapsedSeconds();
    }

    /* Single Object Creators*/
    function bullet() {
        var bullet = gameGroupWithPhysics.bullets.create(player.x + 30 * player.lastDirection, player.y, 'shot');
        game.physics.arcade.enable(bullet);
        bullet.body.velocity.x = 300 * player.lastDirection;
        player.ammo -= 1;
        return bullet;
        //return bullet;
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

        ledge = gameGroupWithPhysics.platforms.create(ledgeX, ledgeY, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(scaleX, scaleY);

        ledgeWidth = platformOriginalWidth * scaleX;
        ledgeHeight = platformOriginalHeight * scaleY;

        borderY = ledgeY - ledgeHeight;

        borderLeft = gameGroupWithPhysics.botBoundaries.create(ledgeX - borderOriginalWidth, borderY, 'border');
        borderLeft.body.immovable = true;
        borderLeft.renderable = false;

        borderRight = gameGroupWithPhysics.botBoundaries.create(ledgeX + ledgeWidth, borderY, 'border');
        borderRight.body.immovable = true;
        borderRight.renderable = false;
    }
    function createLedge(ledgeX, ledgeY, scaleX, scaleY) {
        var ledge = gameGroupWithPhysics.platforms.create(ledgeX, ledgeY, 'ground');
        ledge.body.immovable = true;
        ledge.scale.setTo(scaleX, scaleY);
    }
    function createBot(x, y, dir) {

        var bot = game.add.sprite(x, y, 'robot');

        game.physics.arcade.enable(bot);
        //game.physics.arcade.collide(bot, platforms);
        bot.body.gravity.y = 500;
        bot.animations.add('left', [13, 12, 11, 10, 9], 10, true);
        bot.animations.add('right', [1, 2, 3, 4, 5, 6], 10, true);
        bot.scale.setTo(0.3, 0.28);
        // bot.size=32;
        bot.direction = dir;
        gameGroupWithPhysics.bots.add(bot);

    }

    /*Player Controlls*/
    function createController() {
        controller = game.input.keyboard.createCursorKeys();
        controller.fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    /*Draw Functions*/
    function drawHearts() {
        for (var i = 0; i < player.lives; i += 1) {
            var obj = gameGroupWithPhysics.lives.create(i * 50, 20, 'firstaid');
            obj.fixedToCamera = true;
        }
    }
    function drawAmmo() {
        for (var i = 0; i < player.ammo; i += 1) {
            var obj = gameGroupWithPhysics.playerAmmo.create(i * 25, 555, 'ammo');
            obj.fixedToCamera = true;
            obj.scale.setTo(0.75);
        }
    }

    /*Update Function*/
    var timer = 0;
    var reload = 5;
    function playerUpdate() {
        //collide with ground and platforms
        if (player.alive) {
            game.physics.arcade.collide(player, gameGroupWithPhysics.platforms);
            //retain speed in air or make it 0 when touching ground
            if (player.body.touching.down) {
                player.body.velocity.x = 0;
                player.body.gravity.x = 0;
                //player.body.gravity.y=500

            }

            //movement left/right
            if (controller.left.isDown) {
                //  Move to the left
                player.body.velocity.x = -velocityScale;
                //console.log(player.lastDirection);
                player.animations.play('left');
                player.lastDirection = -1;
                if (!stepSound.isPlaying && player.body.touching.down) {
                    stepSound.play();
                }
            } else if (controller.right.isDown) {
                //  Move to the right
                player.body.velocity.x = velocityScale;
                player.animations.play('right');
                player.lastDirection = 1;
                if (!stepSound.isPlaying && player.body.touching.down) {
                    stepSound.play();
                }

            } else {
                //  Stand still

                if (player.lastDirection == 1) {
                    player.animations.play('faceRight');
                } else {
                    player.animations.play('faceLeft');
                }
            }

            if (controller.fire.isDown && timer >= 15 && player.ammo > 0) {
                bullet();
                timer = 0;
                fireSound.play();
            }
            timer += 1;
            //movement jump
            //prevent continuous jumping
            if (player.body.touching.down && !controller.up.isDown) {
                canJump = true;
            }
            //  Allow the player to jump if they are touching the ground.
            if (controller.up.isDown && player.body.touching.down && canJump) {
                player.body.velocity.y = -300;
                canJump = false;
                jumpSound.play();

            }
            if (controller.up.isDown) {
                player.body.gravity.y = 300;
            } else {
                player.body.gravity.y = 700;
            }
            if (!player.body.touching.down) {
                if (player.lastDirection == 1) {
                    player.animations.play('faceRightJump');
                } else {
                    player.animations.play('faceLeftJump');
                }
            }
            //resistance in x
            var speed = Math.abs(player.body.velocity.x);
            if (speed > 0) {
                player.body.gravity.x = (speed / player.body.velocity.x) * 25 * -1;
            }

            if (player.timeOfLastHit + player.immortalTime < game.time.totalElapsedSeconds()) {
                player.canBeHurt = true;
            } else {
                player.canBeHurt = false;
            }
            if (!player.canBeHurt) {
                player.alpha = Math.random();
            } else {
                player.alpha = 1;
            }
        }
    }
    function botsUpdate() {
        game.physics.arcade.collide(gameGroupWithPhysics.bots, gameGroupWithPhysics.platforms);
        game.physics.arcade.collide(gameGroupWithPhysics.botBoundaries, gameGroupWithPhysics.bots);
        for (var i in gameGroupWithPhysics.bots.children) {
            botUpdate(gameGroupWithPhysics.bots.children[i]);
        }
    }
    function bulletsUpdate() {
        game.physics.arcade.collide(gameGroupWithPhysics.bullets, gameGroupWithPhysics.platforms);
        game.physics.arcade.overlap(gameGroupWithPhysics.bullets, gameGroupWithPhysics.bots, hitBot, null, this);
        game.physics.arcade.overlap(gameGroupWithPhysics.platforms, gameGroupWithPhysics.bots, hitWall, null, this);
        for (var i in gameGroupWithPhysics.bullets.children) {
            if (gameGroupWithPhysics.bullets.children[i].body.touching.left || gameGroupWithPhysics.bullets.children[i].body.touching.right) {
                gameGroupWithPhysics.bullets.children[i].kill();
            }
        }
    }
    function botUpdate(bot) {
        if (bot.body.touching.left) {
            bot.direction *= -1;
        }
        if (bot.body.touching.right) {
            bot.direction *= -1;
        }
        //movement
        bot.body.velocity.x = velocityScale * 1.2 * bot.direction;
        if (bot.body.velocity.x <= 0) {
            bot.animations.play('left');
        } else {
            bot.animations.play('right');
        }
    }
    function cameraUpdate() {

        //keeps in the middle of the screen always
        if (game.camera.x < SCREENSIZE / 2) {
            game.camera.x = 0;
        } //left most camera
        if (game.camera.x > SCREENSIZE * 3 - SCREENSIZE / 2) {
            game.camera.x = SCREENSIZE * 3 - SCREENSIZE / 2;
        } //right most camera
        game.camera.x = player.x - SCREENSIZE / 2;
        game.camera.y = player.y - 300;
    }
    function turretUpdate(){
        var xdist=Math.abs(turret.x-player.x);
        var ydist=turret.y-player.y;
        //console.log(xdist);

        var angle=Math.atan(ydist/xdist)*180/Math.PI;

        console.log(angle);
        turret.angle=angle-10;

        //var


    }
    function playerCollision() {
        game.physics.arcade.collide(gameGroupWithPhysics.bonus, platforms);
        game.physics.arcade.overlap(player, gameGroupWithPhysics.bonus, collect, null, this);
        game.physics.arcade.overlap(player, gameGroupWithPhysics.bots, die, null, this);
        game.physics.arcade.overlap(player, gameGroupWithPhysics.spikes, dieSpike, null, this);

    }

    /*Collision Consequences*/
    function collect(player, bon) {
        bon.kill();
        player.score += 10;
        //player.ammo = 5;
        player.bonusCount +=1;
        pickupSound.play();
        //console.log(player.score);
    }
    function hitBot(bullet, bot) {
        bullet.kill();
        bot.kill();
        player.score += 10;
        botHitSound.play();
        //console.log(player.score);
    }
    function hitWall(bullet, plat) {
        bullet.kill();
        //console.log(player.score);
    }
    function die(player, bot) {
        if (player.canBeHurt) {
            player.lives -= 1;
            player.timeOfLastHit = game.time.totalElapsedSeconds();
            playerHitSound.play();
        }
        //console.log(player.score);
    }
    function dieSpike(player,spike){
        player.lives=0;
    }


}
