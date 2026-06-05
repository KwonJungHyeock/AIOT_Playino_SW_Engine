import Phaser from 'phaser';
import { FONTS, COLORS, NUM, SCENES } from '../../shared/theme.js';
import Button from '../objects/Button.js';
import Eddie from '../objects/Eddie.js';
import { placeBg } from '../assets.js';
import { fadeIn, goTo } from '../fx/transition.js';
import { addVignette } from '../fx/textures.js';

export default class TitleScene extends Phaser.Scene {
  constructor() { super(SCENES.TITLE); }

  preload() {
    // TODO(claude-code): queueSceneBg(this, 'title');
  }

  create() {
    const { width, height } = this.scale;
    fadeIn(this);
    placeBg(this, 'title-bg', NUM.bg);
    addVignette(this);

    this.add.text(width / 2, 200, 'PLAYINO', {
      fontFamily: FONTS.display, fontSize: '92px', color: COLORS.text, fontStyle: '900',
    }).setOrigin(0.5);
    this.add.text(width / 2, 280, 'E S C A P E   R O O M', {
      fontFamily: FONTS.display, fontSize: '26px', color: COLORS.eddie,
    }).setOrigin(0.5).setAlpha(0.9);

    new Eddie(this, width / 2, 410, 0.8);

    new Button(this, width / 2, 540, 'START', () => goTo(this, SCENES.LOGIN));

    this.add.text(width / 2, height - 30, 'Arduino Uno · Web Serial · K-12', {
      fontFamily: FONTS.body, fontSize: '13px', color: COLORS.textDim,
    }).setOrigin(0.5);
  }
}
