import { BASE, NUM } from '../../../../shared/theme.js';
import { Gauge, keyHint, title } from './_helpers.js';

export default function Attitude({ scene, bus, interject, onComplete }) {
  const c = scene.add.container(0, 0);
  c.add(title(scene, '미션 2 · 자세 안정화'));
  const station = scene.add.rectangle(BASE.w / 2, 280, 260, 60, NUM.bg2).setStrokeStyle(2, NUM.eddie, 0.5);
  const ref = scene.add.rectangle(BASE.w / 2, 280, 300, 2, NUM.textDim).setAlpha(0.4);
  const g = new Gauge(scene, 380, 470, { label: '기울기 (수평 0°에 맞춰 유지)', min: -45, max: 45, target: [-8, 8] });
  const hint = keyHint(scene, BASE.w / 2, 540, '← 반시계   → 시계');
  c.add([ref, station, ...g.objs, hint]);
  interject('start');

  let hold = 0, halfDone = false;
  const loop = (t, dt) => {
    const tilt = bus.state.tilt;
    g.setValue(tilt);
    station.setAngle(tilt);
    if (g.inBand) { hold += dt; if (!halfDone && hold > 500) { halfDone = true; interject('half'); } }
    else hold = 0;
    if (hold >= 1000) { scene.events.off('update', loop); interject('success'); onComplete(); }
  };
  scene.events.on('update', loop);
  return { destroy() { scene.events.off('update', loop); g.destroy(); c.destroy(); } };
}
