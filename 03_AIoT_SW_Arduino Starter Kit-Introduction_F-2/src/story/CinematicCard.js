import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS } from '../shared/theme.js';
import { makePortrait, speakerColor } from './Portrait.js';

// 전체화면 시네마틱: 배경 + 타이핑 내레이션 + 초상 + "계속" 힌트.
// lines 배열을 순서대로 보여주고, 탭/스페이스로 진행. 끝나면 resolve.
export default class CinematicCard {
  constructor(scene) { this.scene = scene; }

  play({ lines = [], speaker, bgColor }) {
    const scene = this.scene;
    const c = scene.add.container(0, 0).setDepth(85000);
    const bg = scene.add.rectangle(0, 0, BASE.w, BASE.h, bgColor ?? NUM.bg).setOrigin(0);
    const text = scene.add.text(BASE.w / 2, BASE.h / 2, '', {
      fontFamily: FONTS.kr, fontSize: '30px', color: COLORS.text, align: 'center',
      wordWrap: { width: BASE.w - 320 }, lineSpacing: 10,
    }).setOrigin(0.5);
    const tag = scene.add.text(BASE.w / 2, BASE.h / 2 - 120, '', {
      fontFamily: FONTS.display, fontSize: '16px', color: COLORS.eddie,
    }).setOrigin(0.5);
    const hint = scene.add.text(BASE.w / 2, BASE.h - 60, '탭하여 계속 ▸', {
      fontFamily: FONTS.kr, fontSize: '15px', color: COLORS.textDim,
    }).setOrigin(0.5).setAlpha(0);
    let portrait = null;
    if (speaker) { portrait = makePortrait(scene, speaker).setPosition(BASE.w / 2, BASE.h / 2 - 80); tag.setText(speaker).setColor(speakerColor(speaker)); }
    c.add([bg, text, tag, hint]);
    if (portrait) c.add(portrait);
    this.node = c;

    return new Promise((resolve) => {
      let idx = 0, typing = false, evt = null;
      const showLine = () => {
        typing = true; hint.setAlpha(0); text.setText('');
        const full = lines[idx]; let i = 0;
        evt = scene.time.addEvent({ delay: 30, repeat: full.length - 1, callback: () => {
          i++; text.setText(full.slice(0, i));
          if (i >= full.length) { typing = false; scene.tweens.add({ targets: hint, alpha: 1, duration: 300 }); }
        }});
      };
      const advance = () => {
        if (typing) { evt?.remove(); text.setText(lines[idx]); typing = false; scene.tweens.add({ targets: hint, alpha: 1, duration: 200 }); return; }
        idx++;
        if (idx >= lines.length) { scene.input.off('pointerdown', advance); keySpace.off('down', advance); resolve(); return; }
        showLine();
      };
      scene.input.on('pointerdown', advance);
      const keySpace = scene.input.keyboard.addKey('SPACE');
      keySpace.on('down', advance);
      showLine();
    });
  }

  destroy() { this.node?.destroy(); }
}
