import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS } from '../../../../shared/theme.js';

// 값 게이지: 트랙 + 목표 밴드 + 마커. 밴드 안이면 inBand=true.
export class Gauge {
  constructor(scene, x, y, { label, min, max, target, w = 520 }) {
    this.scene = scene; this.min = min; this.max = max; this.target = target; this.x = x; this.w = w; this.inBand = false;
    this.lbl = scene.add.text(x, y - 26, label, { fontFamily: FONTS.kr, fontSize: '16px', color: COLORS.textDim });
    this.track = scene.add.rectangle(x, y, w, 14, NUM.bg2).setOrigin(0, 0.5).setStrokeStyle(1, NUM.eddie, 0.25);
    const lo = this._px(target[0]), hi = this._px(target[1]);
    this.band = scene.add.rectangle(lo, y, hi - lo, 14, NUM.eddie, 0.18).setOrigin(0, 0.5);
    this.marker = scene.add.rectangle(x, y, 6, 26, NUM.text).setOrigin(0.5);
    this.objs = [this.lbl, this.track, this.band, this.marker];
  }
  _px(v) { return this.x + ((v - this.min) / (this.max - this.min)) * this.w; }
  setValue(v) {
    this.marker.x = Phaser.Math.Clamp(this._px(v), this.x, this.x + this.w);
    this.inBand = v >= this.target[0] && v <= this.target[1];
    this.marker.setFillStyle(this.inBand ? NUM.eddie : NUM.text);
  }
  destroy() { this.objs.forEach((o) => o.destroy()); }
}

export function keyHint(scene, x, y, text) {
  return scene.add.text(x, y, text, { fontFamily: FONTS.kr, fontSize: '15px', color: COLORS.info }).setOrigin(0.5);
}

export function title(scene, text) {
  return scene.add.text(BASE.w / 2, 90, text, { fontFamily: FONTS.display, fontSize: '22px', color: COLORS.eddie }).setOrigin(0.5);
}

// 진행 바 (충전/리부트)
export class Progress {
  constructor(scene, x, y, w = 320) {
    this.x = x; this.w = w; this.v = 0;
    this.back = scene.add.rectangle(x, y, w, 10, NUM.bg2).setOrigin(0, 0.5).setStrokeStyle(1, NUM.success, 0.3);
    this.fill = scene.add.rectangle(x, y, 0, 10, NUM.success).setOrigin(0, 0.5);
    this.objs = [this.back, this.fill];
  }
  set(p) { this.v = Phaser.Math.Clamp(p, 0, 1); this.fill.width = this.w * this.v; }
  destroy() { this.objs.forEach((o) => o.destroy()); }
}
