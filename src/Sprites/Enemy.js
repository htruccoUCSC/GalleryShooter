class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture, frame, score, health, rotation, sound, destructionAnim, damageFrames, depth) {
        super(scene, path, x, y, texture, frame);
        this.score = score;
        this.health = health;
        this.maxHealth = health;
        this.angle = rotation;
        this.sound = sound;
        this.destructionAnim = destructionAnim;
        this.damageLevel = 0;
        this.damageSprite = null;
        this.depth = depth;
        this.damageFrames = damageFrames;
        scene.add.existing(this);
    }

    createDamageSprite() {
        this.damageSprite = this.scene.add.sprite(this.x, this.y, this.texture, null)
        this.damageSprite.depth = this.depth+1;
        this.scene.tweens.add({
            targets: this.damageSprite,
            x: '+=0',
            y: '+=0',
            duration: 1000,
            repeat: -1,
            onUpdate: () => {
                this.damageSprite.x = this.x;
                this.damageSprite.y = this.y;
            }
        });
        this.damageSprite.visible = false;
    }

    showDamage() {
        let healthPercent = (this.health / this.maxHealth) * 100;
        
        if (healthPercent <= 75) {
            if (!this.damageSprite) {
                this.createDamageSprite();
            }
            
            if (healthPercent <= 25 && this.damageLevel < 3) {
                this.damageLevel = 3;
            }
            else if (healthPercent <= 50 && this.damageLevel < 2) {
                this.damageLevel = 2;
            }
            else if (healthPercent <= 75 && this.damageLevel < 1) {
                this.damageLevel = 1;
            }

            this.damageSprite.angle = this.angle;
            this.damageSprite.setFrame(this.damageFrames[this.damageLevel - 1]);
            this.damageSprite.visible = true;
        }
    }

    destroy () {
        this.scene.sound.play(this.sound, {
            volume: 0.25 
        });
        this.scene.add.sprite(this.x, this.y, this.destructionAnim[0]).setScale(0.25).play(this.destructionAnim);
        this.visible = false;
        this.damageSprite.visible = false;
        this.active = false;
        this.damageSprite.active = false;
        this.stopFollow();
    }
}
