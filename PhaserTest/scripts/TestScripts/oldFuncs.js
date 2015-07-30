/**
 * Created by ArgiDux on 7/29/2015.
 */
function createBonus() {
    bonus = game.add.group();
    bonus.enableBody = true;

    //var codeBonus = bonus.create(700, 900 - 600, 'key');
    //codeBonus.scale.setTo(0.2);
}

function createBullets() {
    bullets = game.add.group();
    bullets.enableBody = true;
}

function createBots() {
    bots = game.add.group();
    bots.enableBody = true;
}

function createHearts() {
    lives = game.add.group();
    lives.enableBody = true;

}

function createAmmoIndicator() {
    playerAmmo = game.add.group();
    playerAmmo.enableBody = true;
}