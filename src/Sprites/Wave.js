class Wave {
  constructor(scene, enemyBuffer, player) {
    this.scene = scene;
    this.enemies = [];
    this.enemyQueue = [];
    this.player = player;
    for (let enemyInfo of enemyBuffer) {
      let enemy = new Enemy(
        this.scene,
        this.player,
        enemyInfo.enemy.enemyType,
        enemyInfo.path,
        enemyInfo.path.points[0].x,
        enemyInfo.path.points[0].y,
        enemyInfo.enemy.texture,
        enemyInfo.enemy.frame,
        enemyInfo.enemy.speed,
        enemyInfo.enemy.score,
        enemyInfo.enemy.health,
        enemyInfo.enemy.rotation,
        enemyInfo.enemy.sound,
        enemyInfo.enemy.destructionAnim,
        enemyInfo.enemy.damageFrames,
        enemyInfo.enemy.bulletCount,
        enemyInfo.enemy.bulletSpeed,
        enemyInfo.enemy.bulletFrame,
        enemyInfo.enemy.scale,
        25 * (this.enemyQueue.length + 1)
      );
      enemy.active = false;
      enemy.visible = false;
      this.enemyQueue.push(enemy);
    }

    return this;
  }

  addEnemy(enemyInfo) {
    let enemy = new Enemy(
      this.scene,
      this.player,
      enemyInfo.enemy.enemyType,
      enemyInfo.path,
      enemyInfo.path.points[0].x,
      enemyInfo.path.points[0].y,
      enemyInfo.enemy.texture,
      enemyInfo.enemy.frame,
      enemyInfo.enemy.speed,
      enemyInfo.enemy.score,
      enemyInfo.enemy.health,
      enemyInfo.enemy.rotation,
      enemyInfo.enemy.sound,
      enemyInfo.enemy.destructionAnim,
      enemyInfo.enemy.damageFrames,
      enemyInfo.enemy.bulletCount,
      enemyInfo.enemy.bulletSpeed,
      enemyInfo.enemy.bulletFrame,
      enemyInfo.enemy.scale,
      25 * (this.enemies.length + 1)
    );
    this.enemies.push(enemy);
    enemy.beginFollow();
  }

  startWave() {
    if (this.enemyQueue.length > 0) {
      this.enemyQueue.forEach((enemy, index) => {
        this.scene.time.delayedCall(index * 1500, () => {
          enemy.beginFollow();
          enemy.active = true;
          enemy.visible = true;
          this.enemies.push(enemy);
          this.enemyQueue.splice(0, 1);
        });
      });
    }
  }

  stopWave() {
    if (this.enemies) {
      this.enemies.forEach((enemy) => enemy.stopFollow());
    }
  }

  removeEnemy(enemy) {
    let index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }

  damage(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0) {
      this.removeEnemy(enemy);
      enemy.destroy();
      return enemy.score;
    } else {
      enemy.showDamage();
    }
    return 0;
  }

  destroy() {
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];
    this.enemyQueue.forEach((enemy) => enemy.destroy());
    this.enemyQueue = [];
  }

  update() {
    if (this.enemies.length > 0) {
      this.enemies = this.enemies.filter((enemy) => enemy && enemy.active);
      this.enemies.forEach((enemy) => enemy.update());
    } else if (this.enemyQueue.length < 1) {
      this.destroy();
    }
  }
}
