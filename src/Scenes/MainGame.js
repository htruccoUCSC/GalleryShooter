class MainGame extends Phaser.Scene {
    constructor() {
        super("arrayBoom");
        this.my = {sprite: {}, text: {}};

        this.playerSpeed = 7;
        this.bulletSpeed = 5;

        this.bulletCooldown = 50; 
        this.bulletCooldownCounter = 0;
        
        this.myScore = 0;      
        this.waves = []; 
        this.gameOver = false;
        this.gameActive = false;
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
        let alienHealth = 3;
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

        const parabolicCurve = new Phaser.Curves.Spline([
            50, 80,
            (game.config.width/2), game.config.height - 250,
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
            ],
            bulletCount: 5,
            bulletDelay: 320,
            bulletSpeed: 5,
            bulletFrame: "laserRed15.png" 
        };

        const purpleEnemy = {
            texture: "enemySheet",
            frame: "playerShip1_blue.png",
            health: 100,
            score: 25,
            rotation: 180,
            sound: "dadada",
            destructionAnim: "puff",
            damageFrames: [
                "playerShip1_damage1.png",
                "playerShip1_damage2.png",
                "playerShip1_damage3.png"
            ],
            bulletCount: 5,
            bulletDelay: 250,
            bulletSpeed: 5,
            bulletFrame: "laserRed15.png" 
        };

        my.sprite.wave1 = new Wave (this, 3, sideToSideCurve, greenEnemy, 10, 25);
        my.sprite.wave1.startWave();
        this.waves.push(my.sprite.wave1);
        my.sprite.wave2 = new Wave (this, 2, parabolicCurve, purpleEnemy, 8, 100);
        my.sprite.wave2.startWave();
        this.waves.push(my.sprite.wave2);



        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: fire/emit'

        my.text.score = this.add.bitmapText(5, game.config.height - 30, "rocketSquare", "Score " + this.myScore);
        this.gameActive = true;
    }

    update() {
        let my = this.my;

        if (this.gameActive) {
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
                    for (let wave of this.waves) {
                        for (let enemy of wave.enemies) {
                            if (enemy.active && this.collides(enemy, bullet)) {
                                bullet.y = -100;
                                this.myScore += wave.damage(enemy, 25);
                                this.updateScore();
                                break;
                            }
                        }
                    }
                }
            }

            for (let wave of this.waves) {
                for (let enemy of wave.enemies) {
                    for (let bullet of enemy.bulletGroup.children.entries) {
                        if (bullet.active && my.sprite.alien.active && this.collides(my.sprite.alien, bullet)) {
                            bullet.y = game.config.height + 100;
                            my.sprite.alien.health--;
                            const health = my.sprite.alien.health;
                            if (health < 1) {
                                my.sprite.alien.destroy();
                                this.gameOver = true;
                                this.gameActive = false;
                                my.sprite.wave1.destroy();
                                my.sprite.wave2.destroy();
                            } else if (health < 2) {
                                my.sprite.alien.showOverlay("damageOverlayTexture2");
                            } else if (health < 3) {
                                my.sprite.alien.showOverlay("damageOverlayTexture1");
                            }
                            break;
                        } 
                    }
                }
            }
            my.sprite.alien.update();
            this.waves.forEach(w => w.update());
        } else if (this.gameOver) {
            my.text.gameOver = this.add.text(game.config.width/2 - 120, game.config.height/2 - 50, "Game Over").setDepth(1000);
            my.text.continue = this.add.text(game.config.width/2 - 120, game.config.height/2, "Continue?").setDepth(1000);
            my.text.yes = this.add.text(game.config.width/2 - 120, game.config.height/2 + 50, "Yes").setDepth(1000);
            my.text.no = this.add.text(game.config.width/2 + 50, game.config.height/2 + 50, "No").setDepth(1000);
            my.text.yes.setColor("red");
            this.gameOver = false;
            this.restartHover = true;
        } else {
            if (Phaser.Input.Keyboard.JustDown(this.right)) {
                my.text.no.setColor("red");
                my.text.yes.setColor("white");
                this.restartHover = false;
            } else if (Phaser.Input.Keyboard.JustDown(this.left)) {
                my.text.no.setColor("white");
                my.text.yes.setColor("red");
                this.restartHover = true;
            } else if (this.restartHover && Phaser.Input.Keyboard.JustDown(this.space)) {
                //implement after wave creation is done
                console.log("hello");
            } else if (Phaser.Input.Keyboard.JustDown(this.space)) {
                //implement after wave creation is done
                console.log("goodbye");
            }
        }
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
         