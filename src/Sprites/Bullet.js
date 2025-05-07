class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, angle = 0) {
    super(scene, x, y, texture, frame);
    this.visible = false;
    this.active = false;
    this.angle = angle;
    return this;
  }

  update() {
    if (this.active) {
      const angleRad = Phaser.Math.DegToRad(this.angle);
      this.x += Math.sin(angleRad) * this.speed;
      this.y -= Math.cos(angleRad) * this.speed;

      if (
        this.y < -(this.displayHeight / 2) ||
        this.y > game.config.height + this.displayHeight ||
        this.x < -(this.displayWidth / 2) ||
        this.x > game.config.width + this.displayWidth
      ) {
        this.makeInactive();
      }
    }
  }

  makeActive() {
    this.visible = true;
    this.active = true;
  }

  makeInactive() {
    this.visible = false;
    this.active = false;
  }
}
