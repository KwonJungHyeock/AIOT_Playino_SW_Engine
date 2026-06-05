import { BASE, NUM } from '../../shared/theme.js';

// 절차적 폴백 텍스처(이미지 에셋 없을 때) — 글로우 · 비네트 · 먼지
// 한 번만 생성해 캐시. 실제 아트가 들어오면 자연스럽게 대체됨.

export function ensureGlow(scene, key = 'fx-glow', size = 256) {
  if (scene.textures.exists(key)) return key;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const r = size / 2;
  for (let i = r; i > 0; i--) {
    const a = (i / r) * 0.04;
    g.fillStyle(0xffffff, a);
    g.fillCircle(r, r, i);
  }
  g.generateTexture(key, size, size);
  g.destroy();
  return key;
}

export function ensureVignette(scene, key = 'fx-vignette') {
  if (scene.textures.exists(key)) return key;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * 0.5;
    g.fillStyle(NUM.bg, a);
    g.fillRect(i * 2, i * 2, BASE.w - i * 4, BASE.h - i * 4);
  }
  g.generateTexture(key, BASE.w, BASE.h);
  g.destroy();
  return key;
}

export function addVignette(scene, depth = 9000) {
  const key = ensureVignette(scene);
  return scene.add.image(0, 0, key).setOrigin(0).setDepth(depth).setScrollFactor(0);
}
