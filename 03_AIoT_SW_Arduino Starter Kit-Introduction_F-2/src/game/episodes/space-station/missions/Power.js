import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS } from '../../../../shared/theme.js';
import { Gauge, keyHint, title, Progress } from './_helpers.js';

export default function Power({ scene, bus, interject, onComplete }) {
  const c = scene.add.container(0, 0);
  c.add(title(scene, '미션 4 · 전력 복구'));
  const sun = scene.add.circle(BASE.w / 2 + 220, 250, 26, NUM.amber).setBlendMode(1);
  const hub = scene.add.circle(BASE.w / 2 - 120, 250, 10, NUM.eddie);
  const panel = scene.add.rectangle(BASE.w / 2 - 120, 250, 110, 14, NUM.bg2).setOrigin(0, 0.5).setStrokeStyle(1, NUM.eddie, 0.6);
  const targetAngle = 122; // 태양 방향
  const g = new Gauge(scene, 380, 430, { label: '태양전지판 각도 (태양 방향에 정렬)', min: 0, max: 180, target: [targetAngle - 12, targetAngle + 12] });
  const charge = new Progress(scene, 480, 500);
  c.add([sun, panel, hub, ...g.objs, scene.add.text(360, 494, '전력', { fontFamily: FONTS.kr, fontSize: '15px', color: COLORS.success }), ...charge.objs]);
  const hint = keyHint(scene, BASE.w / 2, 545, 'Q 각도-   E 각도+');
  c.add(hint);
  interject('start');

  let p = 0, halfDone = false;
  const loop = (t, dt) => {
    const a = bus.state.angle;
    g.setValue(a);
    panel.setAngle(a - 90);
    if (g.inBand) p += dt / 2200; else p -= dt / 4000;
    p = Phaser.Math.Clamp(p, 0, 1);
    charge.set(p);
    if (!halfDone && p > 0.5) { halfDone = true; interject('half'); }
    if (p >= 1) { scene.events.off('update', loop); interject('success'); onComplete(); }
  };
  scene.events.on('update', loop);
  return { destroy() { scene.events.off('update', loop); g.destroy(); charge.destroy(); c.destroy(); } };
}
