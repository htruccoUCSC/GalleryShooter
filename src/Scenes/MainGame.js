class MainGame extends Phaser.Scene {
  constructor() {
    super("mainGame");
    this.my = { sprite: {}, text: {} };

    this.playerSpeed = 7;
    this.bulletSpeed = 5;

    this.bulletCooldown = 50;

    this.myScore = 0;
    this.gameOver = false;
    this.gameActive = false;
    this.gameStarting = false;
    this.wave;
    this.currentWave = 1;
    this.selectingBuff = false;
    this.buffHover = 0;
    this.buffSelectionDelay = false;
    this.uniqueBuffs = new Set();
    this.healthHearts = [];

    this.playerTextures = [{ texture: "alien", frame: null, x: 0, y: 0 }];
    this.playerOverlays = [
      { texture: "damageOverlayTexture1", frame: null, x: 0, y: 28 },
      { texture: "damageOverlayTexture2", frame: null, x: 0, y: 28 },
      { texture: "dome", frame: null, x: -1, y: -20 },
    ];
    this.alienHealth = 3;
    this.bulletKey = "laser";
    this.bulletMaxSize = 30;

    this.rocketPaths = [
      new Phaser.Curves.Spline([game.config.width / 2, -300]),
      new Phaser.Curves.Spline([-100, -300]),
      new Phaser.Curves.Spline([game.config.width + 100, -300]),
    ];

    this.rocket = {
      texture: "altEnemySheet",
      frame: "spaceRockets_004.png",
      enemyType: "rocket",
      speed: 8,
      health: 0,
      score: 25,
      rotation: 90,
      sound: "explosion",
      destructionAnim: "puff",
      scale: 0.5,
    };

    this.boss = {
      texture: "enemySheet",
      frame: "playerShip3_red.png",
      enemyType: "boss",
      speed: 0,
      health: 500,
      score: 1000,
      rotation: 180,
      sound: "dadada",
      destructionAnim: "puff",
      damageFrames: [
        "playerShip3_damage1.png",
        "playerShip3_damage2.png",
        "playerShip3_damage3.png",
      ],
      bulletCount: 8,
      bulletSpeed: 8,
      bulletFrame: "laserRed15.png",
      scale: 2.5,
    };

    this.bossPath = new Phaser.Curves.Spline([
      game.config.width * 0.2,
      game.config.height * 0.2,
      game.config.width * 0.8,
      game.config.height * 0.2,
    ]);

    this.enemyPool = [
      {
        texture: "enemySheet",
        frame: "playerShip1_green.png",
        enemyType: "drone",
        speed: 10,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip1_damage1.png",
          "playerShip1_damage2.png",
          "playerShip1_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip1_blue.png",
        enemyType: "drone",
        speed: 8,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip1_damage1.png",
          "playerShip1_damage2.png",
          "playerShip1_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip1_red.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip1_damage1.png",
          "playerShip1_damage2.png",
          "playerShip1_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip1_orange.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip1_damage1.png",
          "playerShip1_damage2.png",
          "playerShip1_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip2_green.png",
        enemyType: "drone",
        speed: 10,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip2_damage1.png",
          "playerShip2_damage2.png",
          "playerShip2_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip2_blue.png",
        enemyType: "drone",
        speed: 8,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip2_damage1.png",
          "playerShip2_damage2.png",
          "playerShip2_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip2_red.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip2_damage1.png",
          "playerShip2_damage2.png",
          "playerShip2_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip2_orange.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip2_damage1.png",
          "playerShip2_damage2.png",
          "playerShip2_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip3_green.png",
        enemyType: "drone",
        speed: 10,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip3_damage1.png",
          "playerShip3_damage2.png",
          "playerShip3_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip3_blue.png",
        enemyType: "drone",
        speed: 8,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip3_damage1.png",
          "playerShip3_damage2.png",
          "playerShip3_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip3_red.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip3_damage1.png",
          "playerShip3_damage2.png",
          "playerShip3_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 5,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
      {
        texture: "enemySheet",
        frame: "playerShip3_orange.png",
        enemyType: "drone",
        speed: 12,
        health: 100,
        score: 25,
        rotation: 180,
        sound: "dadada",
        destructionAnim: "puff",
        damageFrames: [
          "playerShip3_damage1.png",
          "playerShip3_damage2.png",
          "playerShip3_damage3.png",
        ],
        bulletCount: 5,
        bulletSpeed: 10,
        bulletFrame: "laserRed15.png",
        scale: 1,
      },
    ];

    this.pathPool = [
      new Phaser.Curves.Spline([50, 80, game.config.width - 50, 80]),
      new Phaser.Curves.Spline([
        50,
        80,
        game.config.width / 2,
        game.config.height - 250,
        game.config.width - 50,
        80,
      ]),
      new Phaser.Curves.Spline([game.config.width - 50, 80, 50, 80]),
      new Phaser.Curves.Spline([
        game.config.width - 50,
        80,
        game.config.width / 2,
        game.config.height - 250,
        50,
        80,
      ]),
      new Phaser.Curves.Spline([50, 300, game.config.width - 50, 300]),
      new Phaser.Curves.Spline([game.config.width - 50, 300, 50, 300]),
    ];

    this.availableBuffs = [
      {
        name: "Health Up",
        description: "+1 Max Health",
        repeatable: true,
        apply: (player) => {
          player.health++;
          if (player.health == 2) {
            player.hideOverlay("damageOverlayTexture2");
          } else if (player.health == 3) {
            player.hideOverlay("damageOverlayTexture1");
          }
        },
      },
      {
        name: "Fire Rate Up",
        description: "25% Faster Shooting",
        repeatable: true,
        apply: (player) => {
          player.bulletCooldown = Math.floor(player.bulletCooldown * 0.75);
        },
      },
      {
        name: "Speed Up",
        description: "25% Faster Movement",
        repeatable: true,
        apply: (player) => {
          player.playerSpeed = Math.floor(player.playerSpeed * 1.25);
        },
      },
      {
        name: "Size Down",
        description: "25% Smaller Size",
        repeatable: false,
        apply: (player) => {
          player.setScale(player.scale * 0.75);
        },
      },
      {
        name: "Bullet Speed Up",
        description: "25% Faster Bullet Speed",
        repeatable: true,
        apply: (player) => {
          player.increaseBulletSpeed(player.bulletSpeed * 0.25);
        },
      },
      {
        name: "Cone Shot",
        description: "Shoot 3 bullets in a cone",
        repeatable: false,
        apply: (player) => {
          player.hasConeShot = true;
        },
      },
    ];
  }

  create() {
    let my = this.my;
    this.add.tileSprite(0, 0, 1280, 720, "sky").setOrigin(0, 0);
    this.left = this.input.keyboard.addKey("A");
    this.right = this.input.keyboard.addKey("D");
    this.space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    my.text.score = this.add
      .bitmapText(
        5,
        game.config.height - 30,
        "rocketSquare",
        "Score " + this.myScore
      )
      .setDepth(1000);
    my.text.wave = this.add
      .bitmapText(5, -5, "rocketSquare", "Wave " + this.currentWave)
      .setDepth(1000);
    this.gameStarting = true;
  }

  makePlayer() {
    let my = this.my;
    my.sprite.alien = new Player(
      this,
      game.config.width / 2,
      game.config.height - 50,
      this.playerTextures,
      this.playerOverlays,
      this.left,
      this.right,
      this.space,
      this.playerSpeed,
      this.alienHealth,
      this.bulletKey,
      this.bulletMaxSize,
      this.bulletSpeed,
      this.bulletCooldown
    );
    my.sprite.alien.setScale(0.75);
    my.sprite.alien.showOverlay("dome");
    this.updateHealth();
  }

  makeWave() {
    let my = this.my;

    this.enemyBuffer = [];

    if (this.currentWave % 5 === 0) {
      const healthMultiplier = 1 + (this.currentWave - 1) * 0.1;
      const scaledBoss = {
        ...this.boss,
        health: Math.floor(this.boss.health * healthMultiplier),
        bulletSpeed:
          this.boss.bulletSpeed * (1 + (this.currentWave - 1) * 0.05),
      };

      this.enemyBuffer.push({
        enemy: scaledBoss,
        path: this.bossPath,
      });
    } else {
      const baseEnemyCount = 2 + Math.floor(this.currentWave / 2);
      const healthMultiplier = 1 + (this.currentWave - 1) * 0.1;
      const speedMultiplier = 1 + (this.currentWave - 1) * 0.05;

      for (let i = 0; i < baseEnemyCount; i++) {
        const randomEnemy =
          this.enemyPool[Math.floor(Math.random() * this.enemyPool.length)];
        const randomPath =
          this.pathPool[Math.floor(Math.random() * this.pathPool.length)];

        const scaledEnemy = {
          ...randomEnemy,
          health: Math.floor(randomEnemy.health * healthMultiplier),
          speed: randomEnemy.speed * speedMultiplier,
        };

        this.enemyBuffer.push({
          enemy: scaledEnemy,
          path: randomPath,
        });
      }
    }

    my.sprite.wave = new Wave(this, this.enemyBuffer, my.sprite.alien);
  }

  update() {
    let my = this.my;

    if (this.gameStarting) {
      if (!my.text.gameStarting) {
        my.text.gameStarting = this.add
          .text(
            game.config.width / 2 - 120,
            game.config.height / 2 - 50,
            "Press Space to Start"
          )
          .setDepth(1000);
      }
      if (Phaser.Input.Keyboard.JustDown(this.space)) {
        this.currentWave = 1;
        this.makePlayer();
        this.makeWave();
        my.sprite.wave.startWave();
        this.gameStarting = false;
        this.updateWave();
        this.myScore = 0;
        this.updateScore();
        my.text.gameStarting.destroy();
        my.text.gameStarting = null;
        this.gameActive = true;
      }
    } else if (this.gameActive) {
      for (let enemy of my.sprite.wave.enemies) {
        if (enemy.active && this.collides(my.sprite.alien, enemy)) {
          my.sprite.wave.damage(enemy, enemy.health);
          my.sprite.alien.health--;
          this.updateHealth();
          const health = my.sprite.alien.health;
          if (health < 1) {
            this.gameOver = true;
            this.gameActive = false;
          } else if (health < 2) {
            my.sprite.alien.showOverlay("damageOverlayTexture2");
          } else if (health < 3) {
            my.sprite.alien.showOverlay("damageOverlayTexture1");
          }
          break;
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

      for (let enemy of my.sprite.wave.enemies) {
        if (enemy.bulletGroup) {
          for (let bullet of enemy.bulletGroup.children.entries) {
            if (
              bullet.active &&
              my.sprite.alien.active &&
              this.collides(my.sprite.alien, bullet)
            ) {
              bullet.y = game.config.height + 100;
              my.sprite.alien.health--;
              this.updateHealth();
              const health = my.sprite.alien.health;
              if (health < 1) {
                this.gameOver = true;
                this.gameActive = false;
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
      my.sprite.wave.update();

      if (
        this.gameActive &&
        Math.random() < 0.0005 * (1 + (this.currentWave - 1) * 0.2)
      ) {
        let randomPath =
          this.rocketPaths[Math.floor(Math.random() * this.rocketPaths.length)];
        my.sprite.wave.addEnemy({
          enemy: this.rocket,
          path: randomPath,
        });
      }

      if (
        my.sprite.wave.enemies.every((enemy) => !enemy.active) &&
        my.sprite.wave.enemyQueue.length === 0 &&
        my.sprite.alien.active
      ) {
        my.sprite.wave.destroy();
        this.currentWave++;
        this.updateWave();
        this.showBuffSelection();
        this.selectingBuff = true;
        this.gameActive = false;
      }
    } else if (this.selectingBuff) {
      if (!this.buffSelectionDelay) {
        if (Phaser.Input.Keyboard.JustDown(this.right)) {
          this.buffHover = 1;
          my.text.buff1.setColor("white");
          my.text.buff2.setColor("red");
        } else if (Phaser.Input.Keyboard.JustDown(this.left)) {
          this.buffHover = 0;
          my.text.buff1.setColor("red");
          my.text.buff2.setColor("white");
        } else if (Phaser.Input.Keyboard.JustDown(this.space)) {
          const selectedBuff =
            this.buffHover === 0 ? this.currentBuffs[0] : this.currentBuffs[1];
          selectedBuff.apply(my.sprite.alien);

          if (!selectedBuff.repeatable) {
            this.uniqueBuffs.add(selectedBuff.name);
          }

          my.text.buffTitle.destroy();
          my.text.buff1.destroy();
          my.text.buff2.destroy();
          my.text.buffDesc1.destroy();
          my.text.buffDesc2.destroy();
          my.text.currentStats.destroy();

          this.selectingBuff = false;
          this.makeWave();
          my.sprite.wave.startWave();
          this.updateHealth();
          this.gameActive = true;
        }
      }
    } else if (this.gameOver) {
      my.sprite.alien.destroy();

      const highscores =
        JSON.parse(localStorage.getItem("galleryShooterHighscores")) || [];
      highscores.push(this.myScore);
      highscores.sort((a, b) => b - a);
      if (highscores.length > 5) {
        highscores.length = 5;
      }
      localStorage.setItem(
        "galleryShooterHighscores",
        JSON.stringify(highscores)
      );

      my.text.gameOver = this.add
        .text(
          game.config.width / 2 - 120,
          game.config.height / 2 - 50,
          "Game Over"
        )
        .setDepth(1000);
      my.text.continue = this.add
        .text(game.config.width / 2 - 120, game.config.height / 2, "Continue?")
        .setDepth(1000);
      my.text.yes = this.add
        .text(game.config.width / 2 - 120, game.config.height / 2 + 50, "Yes")
        .setDepth(1000);
      my.text.no = this.add
        .text(game.config.width / 2 + 50, game.config.height / 2 + 50, "No")
        .setDepth(1000);
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
      } else if (
        this.restartHover &&
        Phaser.Input.Keyboard.JustDown(this.space)
      ) {
        my.sprite.wave.destroy();
        my.text.gameOver.destroy();
        my.text.continue.destroy();
        my.text.yes.destroy();
        my.text.no.destroy();
        this.gameStarting = true;
      } else if (Phaser.Input.Keyboard.JustDown(this.space)) {
        my.text.gameOver.destroy();
        my.text.continue.destroy();
        my.text.yes.destroy();
        my.text.no.destroy();
        this.scene.start("titleScreen");
      }
    }
  }

  collides(a, b) {
    if (Math.abs(a.x - b.x) > a.displayWidth / 2 + b.displayWidth / 2)
      return false;
    if (Math.abs(a.y - b.y) > a.displayHeight / 2 + b.displayHeight / 2)
      return false;
    return true;
  }

  updateScore() {
    let my = this.my;
    my.text.score.setText("Score " + this.myScore);
  }

  updateWave() {
    let my = this.my;
    my.text.wave.setText("Wave " + this.currentWave);
  }

  updateHealth() {
    let my = this.my;
    this.healthHearts.forEach((heart) => heart.destroy());
    this.healthHearts = [];

    const heartSpacing = 40;
    const startX = game.config.width - 50;
    const y = game.config.height - 30;

    for (let i = 0; i < my.sprite.alien.health; i++) {
      const heart = this.add.sprite(startX - i * heartSpacing, y, "heart");
      heart.setScale(0.8);
      heart.setDepth(1000);
      this.healthHearts.push(heart);
    }
  }

  showBuffSelection() {
    let my = this.my;
    this.selectRandomBuffs();
    this.buffSelectionDelay = true;

    this.time.delayedCall(500, () => {
      my.text.buffTitle = this.add
        .text(
          game.config.width / 2,
          game.config.height / 2 - 100,
          "Select a Buff",
          {
            fontSize: "32px",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);

      my.text.buff1 = this.add
        .text(
          game.config.width / 3,
          game.config.height / 2 - 25,
          this.currentBuffs[0].name,
          {
            fontSize: "24px",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);
      my.text.buffDesc1 = this.add
        .text(
          game.config.width / 3,
          game.config.height / 2 + 25,
          this.currentBuffs[0].description,
          {
            fontSize: "18px",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);

      my.text.buff2 = this.add
        .text(
          (2 * game.config.width) / 3,
          game.config.height / 2 - 25,
          this.currentBuffs[1].name,
          {
            fontSize: "24px",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);
      my.text.buffDesc2 = this.add
        .text(
          (2 * game.config.width) / 3,
          game.config.height / 2 + 25,
          this.currentBuffs[1].description,
          {
            fontSize: "18px",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);

      const currentStats = [
        `Health: ${my.sprite.alien.health}`,
        `Fire Rate: ${(120 / my.sprite.alien.bulletCooldown).toFixed(2)}/s`,
        `Speed: ${my.sprite.alien.playerSpeed}`,
        `Size: ${Math.round((my.sprite.alien.scale / 0.75) * 100)}%`,
        `Bullet Speed: ${my.sprite.alien.bulletSpeed.toFixed(2)}`,
      ];

      my.text.currentStats = this.add
        .text(
          game.config.width / 2,
          game.config.height / 2 + 100,
          "Current Stats:\n" + currentStats.join("\n"),
          {
            fontSize: "18px",
            align: "center",
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);

      my.text.buff1.setColor("red");
      this.buffHover = 0;
      this.buffSelectionDelay = false;
    });
  }

  selectRandomBuffs() {
    let buffPool = [...this.availableBuffs];
    buffPool = buffPool.filter(
      (buff) => buff.repeatable || !this.uniqueBuffs.has(buff.name)
    );

    const firstIndex = Math.floor(Math.random() * buffPool.length);
    const firstBuff = buffPool.splice(firstIndex, 1)[0];

    const secondIndex = Math.floor(Math.random() * buffPool.length);
    const secondBuff = buffPool[secondIndex];

    this.currentBuffs = [firstBuff, secondBuff];
  }
}
