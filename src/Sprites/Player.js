class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textures, overlays, leftKey, rightKey, playerSpeed, health, bulletKey, bulletMaxSize, bulletSpeed) {
        super(scene, x, y);
        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;
        this.health = health;
        this.overlaySprites = [];
        this.bulletKey = bulletKey;
        this.bulletMaxSize = bulletMaxSize;
        this.bulletSpeed = bulletSpeed;
        this.createBulletGroup();

        for (let texture of textures) { 
            let baseSprite = scene.add.sprite(texture.x, texture.y, texture.texture, texture.frame);
            this.add(baseSprite);
        }
        if (overlays) {
            for (let overlay of overlays) {
                let overlaySprite = scene.add.sprite(overlay.x, overlay.y, overlay.texture, overlay.frame);
                overlaySprite.visible = false;
                this.overlaySprites.push(overlaySprite);
                this.add(overlaySprite);
            }
        }
        this.totalWidth = Math.max(...this.list.map(w => w.displayWidth));
        this.totalHeight = Math.max(...this.list.map(w => w.displayHeight));
        scene.add.existing(this);
        return this;
    }

    get displayWidth() {
        return this.totalWidth;
    }

    get displayHeight() {
        return this.totalHeight;
    }

    createBulletGroup() {
        this.bulletGroup = this.scene.add.group({
            active: true,
            defaultKey: this.bulletKey,
            maxSize: this.bulletMaxSize,
            runChildUpdate: true
        });

        this.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            visible: false,
            key: this.bulletKey,
            repeat: this.bulletMaxSize - 1
        });
        this.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
    }

    update() {
        if (this.left.isDown) {
            if (this.x > this.totalWidth/2 + this.playerSpeed) {
                this.x -= this.playerSpeed;
            } else {
                this.x = this.totalWidth/2;
            }
        }

        if (this.right.isDown) {
            if (this.x + this.playerSpeed < (game.config.width - (this.totalWidth/2))) {
                this.x += this.playerSpeed;
            } else {
                this.x = game.config.width - (this.totalWidth/2);
            }
        }
    }

    setScale (x, y) {
        super.setScale(x, y);
        this.totalWidth = Math.max(...this.list.map(w => w.displayWidth)) * this.scale;
        this.totalHeight = Math.max(...this.list.map(w => w.displayHeight)) * this.scale;
        return this;
    }

    showOverlay(overlay) {
        let overlaySprite = this.overlaySprites.find(sprite => sprite.texture.key === overlay);
        if (overlaySprite) {
            overlaySprite.visible = true;
        }
    }

    hideOverlay(overlay) {
        let overlaySprite = this.overlaySprites.find(sprite => sprite.texture.key === overlay);
        if (overlaySprite) {
            overlaySprite.visible = false;
        }
    }
}