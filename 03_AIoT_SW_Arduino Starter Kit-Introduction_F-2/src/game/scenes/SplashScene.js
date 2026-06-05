import Phaser from 'phaser';
import { FONTS, COLORS, SCENES } from '../../shared/theme.js';
import Eddie from '../objects/Eddie.js';
import { fadeIn, goTo } from '../fx/transition.js';
import { addVignette } from '../fx/textures.js';

// 브랜드 스플래시: EDDIE 눈빛 점등 → Title
export default class SplashScene extends Phaser.Scene {
  constructor() { super(SCENES.SPLASH); }

  create() {
    const { width, height } = this.scale;
    fadeIn(this);
    addVignette(this);

    const eddie = new Eddie(this, width / 2, height / 2 - 30, 1.1);
    eddie.setAlpha(0);
    this.tweens.add({ targets: eddie, alpha: 1, duration: 700, ease: 'Sine.out' });

    this.add.text(width / 2, height / 2 + 70, 'EDUINO', {
      fontFamily: FONTS.display, fontSize: '18px', color: COLORS.textDim,
    }).setOrigin(0.5).setAlpha(0.7);

    this.time.delayedCall(1900, () => goTo(this, SCENES.TITLE));
  }
}
