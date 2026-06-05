import { BASE, NUM, COLORS, FONTS } from '../../../../shared/theme.js';
import { Gauge, keyHint, title } from './_helpers.js';

export default function LifeSupport({ scene, bus, interject, onComplete }) {
  const c = scene.add.container(0, 0);
  c.add(title(scene, '미션 3 · 생명유지 복구'));
  c.add(scene.add.text(BASE.w / 2, 150, '거주 모듈 환경을 안전 범위로 맞추고 유지하세요', { fontFamily: FONTS.kr, fontSize: '16px', color: COLORS.textDim }).setOrigin(0.5));
  const gt = new Gauge(scene, 380, 300, { label: '온도 (안전 18~26℃)', min: 0, max: 40, target: [18, 26] });
  const gh = new Gauge(scene, 380, 400, { label: '습도 (안전 40~60%)', min: 0, max: 100, target: [40, 60] });
  const hint = keyHint(scene, BASE.w / 2, 500, 'W/S 온도   A/D 습도');
  const status = scene.add.text(BASE.w / 2, 540, '', { fontFamily: FONTS.display, fontSize: '16px', color: COLORS.warn }).setOrigin(0.5);
  c.add([...gt.objs, ...gh.objs, hint, status]);
  interject('start');

  let hold = 0, halfDone = false;
  const loop = (t, dt) => {
    gt.setValue(bus.state.temp); gh.setValue(bus.state.humi);
    const ok = gt.inBand && gh.inBand;
    status.setText(ok ? '안정 ●' : '불안정 ○').setColor(ok ? COLORS.success : COLORS.warn);
    if (ok) { hold += dt; if (!halfDone && hold > 600) { halfDone = true; interject('half'); } }
    else hold = 0;
    if (hold >= 1200) { scene.events.off('update', loop); interject('success'); onComplete(); }
  };
  scene.events.on('update', loop);
  return { destroy() { scene.events.off('update', loop); gt.destroy(); gh.destroy(); c.destroy(); } };
}
