import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS } from '../shared/theme.js';
import { makePortrait, speakerColor } from './Portrait.js';

// 게임 중 도킹 통신 패널 — EDDIE/AURORA 대사. 플레이를 막지 않음.
export default class CommPanel {
  constructor(scene) {
    this.scene = scene;
    const y = BASE.h - 88;
    this.box = scene.add.rectangle(BASE.w / 2, y, BASE.w - 80, 96, NUM.bg2, 0.92)
      .setStrokeStyle(1, NUM.eddie, 0.25).setDepth(80000);
    this.portrait = makePortrait(scene, 'EDDIE').setPosition(110, y).setDepth(80001);
    this.name = scene.add.text(160, y - 26, 'EDDIE', { fontFamily: FONTS.display, fontSize: '15px', color: COLORS.eddie }).setDepth(80001);
    this.line = scene.add.text(160, y - 2, '', { fontFamily: FONTS.kr, fontSize: '18px', color: COLORS.text, wordWrap: { width: BASE.w - 320 } }).setDepth(80001);
    this.group = [this.box, this.name, this.line];
    this.setVisible(false);
  }

  setVisible(v) { this.group.forEach((g) => g.setVisible(v)); this.portrait?.setVisible(v); }

  // 한 줄 타이핑. 완료 시 resolve.
  say(who, text) {
    this.portrait?.destroy();
    this.portrait = makePortrait(this.scene, who).setPosition(110, BASE.h - 88).setDepth(80001);
    this.setVisible(true);
    this.name.setText(who).setColor(speakerColor(who));
    this.line.setText('');
    if (this._evt) this._evt.remove();
    return new Promise((res) => {
      let i = 0;
      this._evt = this.scene.time.addEvent({
        delay: 28, repeat: text.length - 1,
        callback: () => { i++; this.line.setText(text.slice(0, i)); if (i >= text.length) res(); },
      });
    });
  }

  destroy() { this._evt?.remove(); this.portrait?.destroy(); this.group.forEach((g) => g.destroy()); }
}
