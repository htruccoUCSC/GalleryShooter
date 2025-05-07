class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");

    this.loadText;
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.image("sky", "darkPurple.png");
    this.load.image("alien", "shipGreen_manned.png");
    this.load.image("damageOverlayTexture1", "shipGreen_damage1.png");
    this.load.image("damageOverlayTexture2", "shipGreen_damage2.png");
    this.load.image("dome", "dome.png");
    this.load.image("laser", "laserGreen3.png");
    this.load.image("heart", "heart.png");

    this.load.image("whitePuff00", "whitePuff00.png");
    this.load.image("whitePuff01", "whitePuff01.png");
    this.load.image("whitePuff02", "whitePuff02.png");
    this.load.image("whitePuff03", "whitePuff03.png");

    this.load.bitmapFont(
      "rocketSquare",
      "KennyRocketSquare_0.png",
      "KennyRocketSquare.fnt"
    );

    this.load.audio("dadada", "jingles_NES13.ogg");
    this.load.audio("laser1", "sfx_laser1.ogg");
    this.load.audio("laser2", "sfx_laser2.ogg");
    this.load.audio("explosion", "explosion.mp3");

    this.load.atlasXML("enemySheet", "sheet.png", "sheet.xml");
    this.load.atlasXML(
      "altEnemySheet",
      "spaceShooter2_spritesheet.png",
      "spaceShooter2_spritesheet.xml"
    );
  }

  create() {
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
      hideOnComplete: true,
    });

    this.scene.start("titleScreen");
  }
}
