class MainGame extends Phaser.Scene {
    constructor() {
        super("arrayBoom");
        this.my = {sprite: {}, text: {}};

        this.playerSpeed = 7;
        this.bulletSpeed = 5;

        this.bulletCooldown = 50; 
        this.bulletCooldownCounter = 0;
        
        this.myScore = 0;       
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("sky", "darkPurple.png");
        this.load.image("alien", "shipGreen_manned.png");
        this.load.image("damageOverlayTexture1", "shipGreen_damage1.png");
        this.load.image("damageOverlayTexture2", "shipGreen_damage2.png");
        this.load.image("dome", "dome.png");
        this.load.image("laser", "laserGreen3.png");

        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("dadada", "jingles_NES13.ogg");

        this.load.atlasXML("enemySheet", "sheet.png", "sheet.xml");
    }

    create() {
        let my = this.my;
        this.add.tileSprite(0, 0, 1280, 720, "sky").setOrigin(0, 0);
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let playerTextures = [
            {texture: "alien", frame: null, x: 0, y: 0}
        ];
        let playerOverlays = [
            {texture: "damageOverlayTexture1", frame: null, x: 0, y: 28},
            {texture: "damageOverlayTexture2", frame: null, x: 0, y: 28},
            {texture: "dome", frame: null, x: -1, y: -20}
        ];
        let alienHealth = 100;
        let bulletKey = "laser";
        let bulletMaxSize = 30;
        my.sprite.alien = new Player(this, game.config.width/2, game.config.height - 50 , playerTextures, playerOverlays, this.left, this.right, this.playerSpeed, alienHealth, bulletKey, bulletMaxSize, this.bulletSpeed);
        my.sprite.alien.setScale(0.75);
        my.sprite.alien.showOverlay("dome");

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 30, 
            repeat: 5,
            hideOnComplete: true
        });

        const sideToSideCurve = new Phaser.Curves.Spline([
            50, 80,
            (game.config.width - 50), 80
        ]);
        const greenEnemy = {
            texture: "enemySheet",
            frame: "playerShip1_green.png",
            health: 100,
            score: 25,
            rotation: 180,
            sound: "dadada",
            destructionAnim: "puff",
            damageFrames: [
                "playerShip1_damage1.png",
                "playerShip1_damage2.png",
                "playerShip1_damage3.png"
            ]
        };

        my.sprite.wave = new Wave (this, 3, sideToSideCurve, greenEnemy, 10);
        my.sprite.wave.startWave();

        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: fire/emit'

        my.text.score = this.add.bitmapText(5, game.config.height - 30, "rocketSquare", "Score " + this.myScore);
    }

    update() {
        let my = this.my;

        this.bulletCooldownCounter--;

        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                let bullet = my.sprite.alien.bulletGroup.getFirstDead();
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.alien.x;
                    bullet.y = my.sprite.alien.y - (my.sprite.alien.displayHeight/2);
                }
            }
        }

        for (let bullet of my.sprite.alien.bulletGroup.children.entries) {
            if (bullet.active) {
                for (let enemy of my.sprite.wave.enemies) {
                    if (enemy.active && this.collides(enemy, bullet)) {
                        bullet.y = -100;
                        this.myScore += my.sprite.wave.damage(enemy, 25);
                        this.updateScore();
                        break;
                    }
                }
            }
        }
        my.sprite.alien.update();
        my.sprite.wave.update();
    }

    collides(a, b) { 
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
}
         