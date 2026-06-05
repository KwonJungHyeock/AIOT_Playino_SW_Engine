import Phaser from 'phaser';
import { NUM, COLORS, FONTS } from '../../shared/theme.js';

// 캔버스 내 코드 표시용(예: 자물쇠 다이얼/암호판). 로그인 입력은 DOM(ui/login.js) 사용.
export default class CodeInput extends Phaser.GameObjects.Container {
  constructor(scene, x, y, digits = 8) {
    super(scene, x, y);
    this.slots = [];
    const gap = 44;
    const startX = -((digits - 1) * gap) / 2;
    for (let i = 0; i < digits; i++) {
      const box = scene.add.rectangle(startX + i * gap, 0, 36, 48, NUM.bg2).setStrokeStyle(1, NUM.eddie, 0.4);
      const t = scene.add.text(startX + i * gap, 0, '_', {
        fontFamily: FONTS.display, fontSize: '26px', color: COLORS.eddie,
      }).setOrigin(0.5);
      this.add([box, t]);
      this.slots.push(t);
    }
    scene.add.existing(this);
  }

  setValue(str = '') {
    this.slots.forEach((t, i) => t.setText(str[i] ?? '_'));
  }
}
