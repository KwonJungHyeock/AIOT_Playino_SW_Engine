import Phaser from 'phaser';
import { NUM } from '../../shared/theme.js';

// EDDIE — 브랜드 마스코트(폐연구소 잔존 AI). 청록 눈빛 시그니처.
// 실제 아트(characters/eddie.png) 들어오기 전 절차적 플레이스홀더.
export default class Eddie extends Phaser.GameObjects.Container {
  constructor(scene, x, y, scale = 1) {
    super(scene, x, y);

    const shell = scene.add.circle(0, 0, 54 * scale, NUM.bg2).setStrokeStyle(2, NUM.eddie, 0.5);
    this.eyeL = scene.add.circle(-18 * scale, -4 * scale, 9 * scale, NUM.eddie);
    this.eyeR = scene.add.circle(18 * scale, -4 * scale, 9 * scale, NUM.eddie);
    [this.eyeL, this.eyeR].forEach((e) => e.setBlendMode(Phaser.BlendModes.ADD));

    this.add([shell, this.eyeL, this.eyeR]);
    scene.add.existing(this);

    // 눈빛 깜빡임(불안정한 AI 느낌)
    this.blink = scene.tweens.add({
      targets: [this.eyeL, this.eyeR],
      alpha: { from: 1, to: 0.45 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  destroy(fromScene) {
    this.blink?.remove();
    super.destroy(fromScene);
  }
}
