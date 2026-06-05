import Phaser from 'phaser';
import { FONTS, COLORS, NUM, SCENES } from '../../shared/theme.js';
import { placeBg } from '../assets.js';
import { fadeIn, goTo } from '../fx/transition.js';
import { addVignette } from '../fx/textures.js';
import { showLogin, hideLogin } from '../../ui/login.js';

export default class LoginScene extends Phaser.Scene {
  constructor() { super(SCENES.LOGIN); }

  create() {
    const { width } = this.scale;
    fadeIn(this);
    placeBg(this, 'login-bg', NUM.bg);
    addVignette(this);

    this.add.text(width / 2, 110, 'SYSTEM LOCKED', {
      fontFamily: FONTS.display, fontSize: '28px', color: COLORS.red,
    }).setOrigin(0.5).setAlpha(0.85);

    // 8자리 클래스 코드 = DOM 오버레이 입력
    showLogin({
      onSubmit: (code) => {
        localStorage.setItem('playino.classCode', code);
        hideLogin();
        goTo(this, SCENES.EPISODE, { classCode: code });
      },
    });

    this.events.once('shutdown', hideLogin);
  }
}
