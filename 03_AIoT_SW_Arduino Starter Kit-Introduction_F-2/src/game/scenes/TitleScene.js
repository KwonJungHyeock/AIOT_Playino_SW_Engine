import Phaser from 'phaser';
import { NUM, SCENES } from '../../shared/theme.js';
import { placeBg } from '../assets.js';
import { fadeIn, goTo } from '../fx/transition.js';

// 타이틀: 배경 아트에 타이틀/시작 버튼/안내가 이미 포함됨.
// 코드는 배경을 깔고 입력만 받는다(중복 텍스트·버튼을 그리지 않음).
export default class TitleScene extends Phaser.Scene {
  constructor() { super(SCENES.TITLE); }

  create() {
    const { width, height } = this.scale;
    fadeIn(this);
    placeBg(this, 'title-bg', NUM.bg);

    // 배경의 '시작하기' 버튼 위에 은은한 호버 글로우(클릭 유도). 위치는 아트 기준 추정.
    const hot = this.add.rectangle(width / 2, height - 96, 300, 64, NUM.eddie, 0.001)
      .setInteractive({ useHandCursor: true });
    const glow = this.add.rectangle(width / 2, height - 96, 300, 64, NUM.eddie, 0)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: glow, fillAlpha: 0.12, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const start = () => { if (this._went) return; this._went = true; goTo(this, SCENES.LOGIN); };
    hot.on('pointerdown', start);
    this.input.keyboard.once('keydown-ENTER', start);
    this.input.keyboard.once('keydown-SPACE', start);
  }
}
