import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS, SCENES } from '../../shared/theme.js';
import { ensureGlow, ensureVignette } from '../fx/textures.js';
import { goTo } from '../fx/transition.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super(SCENES.PRELOAD); }

  preload() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 40, 'LOADING', {
      fontFamily: FONTS.display, fontSize: '20px', color: COLORS.eddie,
    }).setOrigin(0.5).setAlpha(0.8);

    const barW = 360;
    const back = this.add.rectangle(width / 2, height / 2 + 10, barW, 6, NUM.bg2).setStrokeStyle(1, NUM.eddie, 0.3);
    const bar = this.add.rectangle(width / 2 - barW / 2, height / 2 + 10, 0, 6, NUM.eddie).setOrigin(0, 0.5);
    this.load.on('progress', (p) => bar.width = barW * p);

    // TODO(claude-code): 실제 에셋은 장면별 preload에서 queueSceneBg() 사용
  }

  create() {
    ensureGlow(this);
    ensureVignette(this);
    goTo(this, SCENES.SPLASH);
  }
}
