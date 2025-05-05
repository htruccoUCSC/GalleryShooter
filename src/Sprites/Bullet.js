class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {
        if (this.active) {
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2) || this.y > (game.config.height + this.displayHeight)) {
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