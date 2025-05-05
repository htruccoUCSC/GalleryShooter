class Wave {
    constructor(scene, enemyCount, path, enemyInfo, speed) {
        this.scene = scene;
        this.enemies = [];
        this.path = path;
        this.enemyCount = enemyCount;
        this.speed = speed;

        for (let i = 0; i < this.enemyCount; i++) {
            let enemy = new Enemy(
                this.scene,
                this.path,
                this.path.points[0].x,
                this.path.points[0].y,
                enemyInfo.texture,
                enemyInfo.frame,
                enemyInfo.score,
                enemyInfo.health,
                enemyInfo.rotation,
                enemyInfo.sound,
                enemyInfo.destructionAnim,
                enemyInfo.damageFrames,
                (25 * (i+1))
            );
            enemy.number = i;
            this.enemies.push(enemy);
        }

        return this;
    }

    startWave() {
        if (this.enemies) {
            this.enemies.forEach(enemy => enemy.startFollow({
                ease: "Linear.InOut",
                duration: (this.speed * 500),
                yoyo: true,
                repeat: -1,
                startAt: 0,
                delay: 250 * enemy.number * this.speed,
            }));
        }
    }

    stopWave() {
        if (this.enemies) {
            this.enemies.forEach(enemy => enemy.stopFollow());
        }
    }

    damage(enemy, damage) {
        enemy.health -= damage;
        if (enemy.health <=0) {
            enemy.destroy();
            this.removeEnemy(enemy);
            return enemy.score;
        } else {
            enemy.showDamage();
        }
        return 0;
    }

    removeEnemy(enemy) {
        let index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    update() {
        if (this.enemies) {
            this.enemies.forEach(enemy => enemy.update());
        }
    }
}
