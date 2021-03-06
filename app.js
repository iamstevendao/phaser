var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update })

function preload () {
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png')
    game.load.image('star', 'assets/star.png')
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48)
}

var platforms
var player
var cursors
var stars
var score = 0
var scoreText

function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.add.sprite(0, 0, 'sky')

    platforms = game.add.group()
    platforms.enableBody = true

    // ground
    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2)
    ground.body.immovable = true

    // 2 ledges
    let ledge = platforms.create(400, 400, 'ground')
    ledge.body.immovable = true
    ledge = platforms.create(-150, 250, 'ground')
    ledge.body.immovable = true

    // player
    player = game.add.sprite(32, game.world.height - 150, 'dude')
    game.physics.arcade.enable(player)

    // physics properties
    player.body.bounce.y = 0.2
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    // player animations when go left or right
    player.animations.add('left', [0, 1, 2, 3], 10, true)
    player.animations.add('right', [5, 6, 7, 8], 10, true)

    // stars
    stars = game.add.group()
    stars.enableBody = true

    for (let i = 0; i < 12; i++) {
        let star = stars.create(i * 70, 0, 'star')
        star.body.gravity.y = 150
        star.body.bounce.y = 0.7 + Math.random() * 0.2
    }

    // score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })

    // cursors
    cursors = game.input.keyboard.createCursorKeys()
}

function update () {
    // player collides platforms
    let hitPlatform = game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(stars, platforms)
    game.physics.arcade.overlap(player, stars, collectStar, null, this)
    player.body.velocity.x = 0

    if (cursors.left.isDown) {
        // move to the left
        player.body.velocity.x = -150
        player.animations.play('left')
    } else if (cursors.right.isDown) {
        // move to the right
        player.body.velocity.x = 150
        player.animations.play('right')
    } else {
        // stand still
        player.animations.stop()
        player.frame = 4
    }

    // jump when user press UP when touching the ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -350
    }
}

function collectStar (player, star) {
    star.kill()
    score += 10
    console.log('score: ', score)
    scoreText.text = 'Score: ' + score
}