class Enemy extends Phaser.GameObjects.PathFollower {
  constructor(
    scene,
    player,
    enemyType,
    path,
    x,
    y,
    texture,
    frame,
    speed,
    score,
    health,
    rotation,
    sound,
    destructionAnim,
    damageFrames,
    bulletCount,
    bulletSpeed,
    bulletFrame,
    scale,
    depth
  ) {
    super(scene, path, x, y, texture, frame);
    this.player = player;
    this.enemyType = enemyType;
    this.score = score;
    this.speed = speed;
    this.health = health;
    this.maxHealth = health;
    this.angle = rotation;
    this.sound = sound;
    this.destructionAnim = destructionAnim;
    this.damageLevel = 0;
    this.damageSprite = null;
    this.depth = depth;
    this.damageFrames = damageFrames;
    this.attackPattern = 0;
    this.attackTimer = 0;
    this.attackDelay = 120;
    this.scale = scale;

    if (this.enemyType === "boss") {
      this.createHealthBar();
    }

    if (bulletCount) {
      this.bulletCount = bulletCount;
      this.bulletDelay = 30;
      this.bulletDelayCounter = 0;
      this.bulletSpeed = bulletSpeed;
      this.bulletFrame = bulletFrame;
      this.bulletGroup;
      this.createBulletGroup();
    }
    this.setScale(this.scale);
    scene.add.existing(this);
  }

  createHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    const x = this.x - barWidth / 2;
    const y = this.y - this.displayHeight / 2 - 30;

    this.healthBarBg = this.scene.add
      .rectangle(x, y, barWidth, barHeight, 0x000000)
      .setOrigin(0, 0)
      .setDepth(this.depth + 2);

    this.healthBar = this.scene.add
      .rectangle(x, y, barWidth, barHeight, 0xff0000)
      .setOrigin(0, 0)
      .setDepth(this.depth + 2);

    this.scene.tweens.add({
      targets: [this.healthBarBg, this.healthBar],
      x: "+=0",
      y: "+=0",
      duration: 1000,
      repeat: -1,
      onUpdate: () => {
        this.healthBarBg.x = this.x - barWidth / 2;
        this.healthBarBg.y = this.y - this.displayHeight / 2 - 30;
        this.healthBar.x = this.x - barWidth / 2;
        this.healthBar.y = this.y - this.displayHeight / 2 - 30;
        this.healthBar.width = (this.health / this.maxHealth) * barWidth;
      },
    });
  }

  createBulletGroup() {
    this.bulletGroup = this.scene.add.group({
      active: true,
      defaultKey: this.texture,
      maxSize: this.bulletCount,
      runChildUpdate: true,
    });

    this.bulletGroup.createMultiple({
      classType: Bullet,
      active: false,
      visible: false,
      key: this.texture,
      frame: this.bulletFrame,
      repeat: this.bulletCount - 1,
    });
    this.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
  }

  createDamageSprite() {
    this.damageSprite = this.scene.add.sprite(
      this.x,
      this.y,
      this.texture,
      null
    );
    this.damageSprite.setScale(this.scale);
    this.damageSprite.depth = this.depth + 1;
    this.scene.tweens.add({
      targets: this.damageSprite,
      x: "+=0",
      y: "+=0",
      duration: 1000,
      repeat: -1,
      onUpdate: () => {
        this.damageSprite.x = this.x;
        this.damageSprite.y = this.y;
      },
    });
    this.damageSprite.visible = false;
  }

  beginFollow() {
    if (this.enemyType === "rocket") {
      let dx = this.player.x - this.x;
      let dy = this.player.y - this.y;
      let angle = Math.atan2(dy, dx);
      let distance = 500;
      const path = new Phaser.Curves.Spline([
        this.x,
        this.y,
        this.player.x,
        this.player.y,
        this.player.x + Math.cos(angle) * distance,
        this.player.y + Math.sin(angle) * distance,
      ]);
      this.setPath(path);
      this.startFollow({
        ease: "Linear",
        duration: 40000 / this.speed,
        rotateToPath: true,
        rotationOffset: this.angle,
        onComplete: () => {
          if (this.active) {
            this.destroy();
          }
        },
      });
    } else if (this.enemyType === "boss") {
      this.startFollow({
        ease: "Linear",
        duration: 40000,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.startFollow({
        ease: "Linear",
        duration: 40000 / this.speed,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  showDamage() {
    if (this.damageFrames) {
      let healthPercent = (this.health / this.maxHealth) * 100;

      if (healthPercent <= 75) {
        if (!this.damageSprite) {
          this.createDamageSprite();
        }

        if (healthPercent <= 25 && this.damageLevel < 3) {
          this.damageLevel = 3;
        } else if (healthPercent <= 50 && this.damageLevel < 2) {
          this.damageLevel = 2;
        } else if (healthPercent <= 75 && this.damageLevel < 1) {
          this.damageLevel = 1;
        }

        this.damageSprite.angle = this.angle;
        this.damageSprite.setFrame(this.damageFrames[this.damageLevel - 1]);
        this.damageSprite.visible = true;
      }
    }
  }

  destroy() {
    this.scene.sound.play(this.sound, {
      volume: 0.25,
    });
    this.scene.add
      .sprite(this.x, this.y, this.destructionAnim[0])
      .setScale(0.25)
      .play(this.destructionAnim);
    if (this.damageSprite) {
      this.damageSprite.visible = false;
      this.damageSprite.active = false;
    }
    if (this.bulletGroup) {
      this.bulletGroup.destroy(true);
    }
    if (this.enemyType === "boss") {
      this.healthBar.destroy();
      this.healthBarBg.destroy();
    }
    super.destroy();
  }

  fireBullet(angle) {
    let bullet = this.bulletGroup.getFirstDead();
    if (bullet != null) {
      this.scene.sound.play("laser2", {
        volume: 0.25,
      });
      bullet.makeActive();
      bullet.x = this.x;
      bullet.y = this.y + this.displayHeight / 2;
      bullet.angle = angle;
    }
  }

  update() {
    if (this.enemyType === "boss") {
      this.attackTimer++;
      if (this.attackTimer >= this.attackDelay) {
        this.attackTimer = 0;
        const healthPercent = (this.health / this.maxHealth) * 100;
        const pattern0Weight =
          healthPercent < 25 ? 0.7 : healthPercent < 50 ? 0.5 : 0.3;
        const pattern1Weight =
          healthPercent < 25 ? 0.2 : healthPercent < 50 ? 0.3 : 0.4;
        const rand = Math.random();
        if (rand < pattern0Weight) {
          for (let i = -2; i <= 2; i++) {
            this.fireBullet(180 + i * 15);
          }
        } else if (rand < pattern0Weight + pattern1Weight) {
          this.fireBullet(180);
          this.fireBullet(180);
        } else {
          let angle =
            Phaser.Math.RadToDeg(
              Math.atan2(this.player.y - this.y, this.player.x - this.x)
            ) + 90;
          this.fireBullet(angle);
        }
      }
    } else {
      this.bulletDelayCounter++;
      if (this.bulletCount) {
        if (this.bulletDelayCounter > this.bulletDelay) {
          if (Math.abs(this.x - this.player.x) <= 3) {
            this.fireBullet(180);
            this.bulletDelayCounter = 0;
          }
        }
      }
    }
  }
}
