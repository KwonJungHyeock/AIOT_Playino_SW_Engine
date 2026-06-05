import { BASE, NUM } from '../../shared/theme.js';

// 트윈 기반 페이드 전환 (카메라 fade 이벤트 비의존 — 스펙 §6)
export function fadeIn(scene, dur = 450) {
  const r = scene.add.rectangle(0, 0, BASE.w, BASE.h, NUM.bg).setOrigin(0).setDepth(99999);
  scene.tweens.add({ targets: r, alpha: 0, duration: dur, onComplete: () => r.destroy() });
}

export function goTo(scene, key, data = {}, dur = 450) {
  const r = scene.add.rectangle(0, 0, BASE.w, BASE.h, NUM.bg).setOrigin(0).setAlpha(0).setDepth(99999);
  scene.tweens.add({
    targets: r,
    alpha: 1,
    duration: dur,
    onComplete: () => scene.scene.start(key, data),
  });
}
