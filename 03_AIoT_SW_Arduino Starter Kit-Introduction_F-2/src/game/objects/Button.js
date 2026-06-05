import Phaser from 'phaser';
import { NUM, COLORS, FONTS } from '../../shared/theme.js';

// 재사용 버튼: 라운드 rect + 텍스트 + hover/press
export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, opts = {}) {
    super(scene, x, y);
    const w = opts.w ?? 260;
    const h = opts.h ?? 60;
    const accent = opts.accent ?? NUM.eddie;

    this.bg = scene.add.rectangle(0, 0, w, h, NUM.bg2).setStrokeStyle(1.5, accent, 0.6);
    this.label = scene.add.text(0, 0, label, {
      fontFamily: FONTS.display,
      fontSize: opts.fontSize ?? '22px',
      color: COLORS.text,
    }).setOrigin(0.5);

    this.add([this.bg, this.label]);
    this.setSize(w, h);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerover', () => this.bg.setFillStyle(accent, 0.15));
    this.on('pointerout', () => this.bg.setFillStyle(NUM.bg2, 1));
    this.on('pointerdown', () => this.setScale(0.97));
    this.on('pointerup', () => { this.setScale(1); onClick?.(); });

    scene.add.existing(this);
  }
}
