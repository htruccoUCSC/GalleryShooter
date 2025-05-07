class TitleScreen extends Phaser.Scene {
  constructor() {
    super("titleScreen");
    this.my = { sprite: {}, text: {} };
  }

  create() {
    let my = this.my;
    this.add.tileSprite(0, 0, 1280, 720, "sky").setOrigin(0, 0);

    this.add
      .bitmapText(game.config.width / 2, 100, "rocketSquare", "GALLERY SHOOTER")
      .setOrigin(0.5)
      .setScale(2);

    my.sprite.startButton = this.add.sprite(
      game.config.width / 2,
      250,
      "enemySheet",
      "buttonBlue.png"
    );
    my.sprite.creditsButton = this.add.sprite(
      game.config.width / 2,
      300,
      "enemySheet",
      "buttonGreen.png"
    );
    my.sprite.controlsButton = this.add.sprite(
      game.config.width / 2,
      350,
      "enemySheet",
      "buttonRed.png"
    );

    my.text.startText = this.add
      .text(game.config.width / 2, 250, "START GAME", {
        fontSize: "28px",
        fill: "#000",
      })
      .setOrigin(0.5);

    my.text.creditsText = this.add
      .text(game.config.width / 2, 300, "CREDITS", {
        fontSize: "28px",
        fill: "#000",
      })
      .setOrigin(0.5);

    my.text.controlsText = this.add
      .text(game.config.width / 2, 350, "CONTROLS", {
        fontSize: "28px",
        fill: "#000",
      })
      .setOrigin(0.5);

    my.sprite.startButton.setInteractive();

    my.sprite.startButton.on("pointerdown", () => {
      this.scene.start("mainGame");
    });

    my.sprite.creditsButton.setInteractive();

    my.sprite.creditsButton.on("pointerdown", () => {
      this.showCredits();
    });

    my.sprite.controlsButton.setInteractive();

    my.sprite.controlsButton.on("pointerdown", () => {
      this.showControls();
    });

    this.add
      .bitmapText(game.config.width / 2, 400, "rocketSquare", "HIGHSCORES")
      .setOrigin(0.5)
      .setScale(1.5);

    this.displayHighscores();
  }

  displayHighscores() {
    const highscores = this.getHighscores();
    const startY = 450;
    const spacing = 40;

    highscores.forEach((score, index) => {
      this.add
        .bitmapText(
          game.config.width / 2 - 100,
          startY + index * spacing,
          "rocketSquare",
          `${index + 1}. ${score}`
        )
        .setOrigin(0, 0.5);
    });
  }

  getHighscores() {
    const highscores =
      JSON.parse(localStorage.getItem("galleryShooterHighscores")) || [];
    return highscores.sort((a, b) => b - a).slice(0, 5);
  }

  showCredits() {
    const credits = [
      "Game created by: Sonny Trucco",
      "Art assets: Kenney Assets",
      "Base code: Jim Whitehead",
      "Engine: Phaser 3",
    ];

    const creditsText = this.add.container(
      game.config.width / 2,
      game.config.height / 2
    );

    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.8).setOrigin(0.5);
    creditsText.add(bg);

    credits.forEach((text, index) => {
      const textObj = this.add
        .text(0, -100 + index * 50, text, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      creditsText.add(textObj);
    });

    const creditsCloseButton = this.add
      .text(250, -150, "X", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => creditsText.destroy());

    creditsText.add(creditsCloseButton);
  }

  showControls() {
    const controls = ["A: left", "D: right", "Space: fire/start/select"];

    const controlsText = this.add.container(
      game.config.width / 2,
      game.config.height / 2
    );

    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.8).setOrigin(0.5);
    controlsText.add(bg);

    controls.forEach((text, index) => {
      const textObj = this.add
        .text(0, -100 + index * 50, text, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      controlsText.add(textObj);
    });

    const controlsCloseButton = this.add
      .text(250, -150, "X", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => controlsText.destroy());

    controlsText.add(controlsCloseButton);
  }
}
