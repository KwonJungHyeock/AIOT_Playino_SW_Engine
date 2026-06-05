import Phaser from 'phaser';
import { FONTS, COLORS, SCENES } from '../../shared/theme.js';
import Eddie from '../objects/Eddie.js';
import { fadeIn } from '../fx/transition.js';
import { addVignette } from '../fx/textures.js';

// 허브/룸 자리 placeholder. 컨셉 확정 후 Hub + Room 씬으로 대체.
export default class ComingSoonScene extends Phaser.Scene {
  constructor() { super(SCENES.HUB); }

  create(data) {
    const { width, height } = this.scale;
    fadeIn(this);
    addVignette(this);

    new Eddie(this, width / 2, height / 2 - 60, 1.0);
    this.add.text(width / 2, height / 2 + 20, '탈출 시작 — 준비 중', {
      fontFamily: FONTS.kr, fontSize: '24px', color: COLORS.text,
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 56, `접속 코드: ${data?.classCode ?? '----'}`, {
      fontFamily: FONTS.display, fontSize: '15px', color: COLORS.eddie,
    }).setOrigin(0.5).setAlpha(0.8);

    this.add.text(width / 2, height - 40,
      '여기에 Hub(방 선택) → Room(센서 퍼즐) 씬이 들어갑니다',
      { fontFamily: FONTS.kr, fontSize: '13px', color: COLORS.textDim }).setOrigin(0.5);
  }
}
