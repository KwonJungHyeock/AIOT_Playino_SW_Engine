import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS } from '../../../../shared/theme.js';
import { Gauge, keyHint, title, Progress } from './_helpers.js';

export default function CoreBoss({ scene, bus, interject, onComplete }) {
  const c = scene.add.container(0, 0);
  c.add(title(scene, '미션 5 · 코어 재가동'));
  c.add(scene.add.text(BASE.w / 2, 150, '자세와 전력을 동시에 유지해 코어를 재시작하라', { fontFamily: FONTS.kr, fontSize: '16px', color: COLORS.textDim }).setOrigin(0.5));
  const ga = new Gauge(scene, 380, 290, { label: '자세 (← →)', min: -45, max: 45, target: [-8, 8] });
  const gp = new Gauge(scene, 380, 390, { label: '전력 각도 (Q E)', min: 0, max: 180, target: [110, 134] });
  const reboot = new Progress(scene, 480, 470);
  const lcd = scene.add.text(BASE.w / 2, 520, 'REBOOT  0%', { fontFamily: FONTS.display, fontSize: '20px', color: COLORS.warn }).setOrigin(0.5);
  c.add([...ga.objs, ...gp.objs, scene.add.text(360, 464, 'CORE', { fontFamily: FONTS.kr, fontSize: '15px', color: COLORS.success }), ...reboot.objs, lcd,
    keyHint(scene, BASE.w / 2, 555, '← → 자세 · Q E 전력 — 둘 다 청록으로!')]);
  interject('start');

  let p = 0, halfDone = false;
  const loop = (t, dt) => {
    // 드리프트: 가만 두면 둘 다 어긋남 → 양손으로 교정해야 함
    bus.state.tilt = Phaser.Math.Clamp(bus.state.tilt + 9 * (dt / 1000), -45, 45);
    bus.state.angle = Phaser.Math.Clamp(bus.state.angle - 11 * (dt / 1000), 0, 180);
    ga.setValue(bus.state.tilt); gp.setValue(bus.state.angle);
    const both = ga.inBand && gp.inBand;
    if (both) p += dt / 2600; else p -= dt / 5000;
    p = Phaser.Math.Clamp(p, 0, 1);
    reboot.set(p);
    lcd.setText('REBOOT  ' + Math.round(p * 100) + '%').setColor(both ? COLORS.success : COLORS.warn);
    if (!halfDone && p > 0.5) { halfDone = true; interject('half'); }
    if (p >= 1) { scene.events.off('update', loop); interject('success'); onComplete(); }
  };
  scene.events.on('update', loop);
  return { destroy() { scene.events.off('update', loop); ga.destroy(); gp.destroy(); reboot.destroy(); c.destroy(); } };
}
