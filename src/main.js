"use strict";

let config = {
  parent: "phaser-game",
  type: Phaser.CANVAS,
  render: {
    pixelArt: true,
  },
  fps: { forceSetTimeOut: true, target: 60 },
  width: 1280,
  height: 720,
  scene: [Preloader, TitleScreen, MainGame],
};

const game = new Phaser.Game(config);
