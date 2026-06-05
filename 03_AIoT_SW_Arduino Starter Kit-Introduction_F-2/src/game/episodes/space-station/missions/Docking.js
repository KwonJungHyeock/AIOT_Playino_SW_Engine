import { BASE, NUM } from '../../../../shared/theme.js';
import { Gauge, keyHint, title } from './_helpers.js';

export default function Docking({ scene, bus, interject, onComplete }) {
  const c = scene.add.container(0, 0);
  c.add(title(scene, '미션 1 · 도킹'));
  const station = scene.add.rectangle(BASE.w / 2, 230, 120, 80, NUM.bg2).setStrokeStyle(2, NUM.eddie, 0.5);
  const ship = scene.add.circle(BASE.w / 2, 360, 16, NUM.eddie).setBlendMode(1);
  const g = new Gauge(scene, 380, 470, { label: '도킹 거리 (목표 구간 안에서 정지)', min: 0, max: 100, target: [40, 60] });
  const hint = keyHint(scene, BASE.w / 2, 540, '↑ 가까이   ↓ 멀리');
  c.add([station, ship, ...g.objs, hint]);
  interject('start');

  let hold = 0, halfDone = false;
  const loop = (t, dt) => {
    const d = bus.state.dist;
    g.setValue(d);
    ship.y = 300 + (d / 100) * 90;
    if (g.inBand) { hold += dt; if (!halfDone && hold > 500) { halfDone = true; interject('half'); } }
    else hold = 0;
    if (hold >= 1000) { scene.events.off('update', loop); interject('success'); onComplete(); }
  };
  scene.events.on('update', loop);
  return { destroy() { scene.events.off('update', loop); g.destroy(); c.destroy(); } };
}
