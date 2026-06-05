// 에셋 슬롯 탐지: public/assets/<장면>/bg.png 가 있으면 사용, 없으면 절차적 폴백.
// Vite 정적 자산은 base './' 기준 'assets/...' 경로로 접근.

export const ASSET_ROOT = 'assets';

// 씬 preload에서 호출. 로드 실패해도 게임이 죽지 않게 loaderror를 흡수.
export function queueSceneBg(scene, folder, key = `${folder}-bg`) {
  scene.load.image(key, `${ASSET_ROOT}/${folder}/bg.png`);
  scene.load.once('loaderror', (file) => {
    if (file.key === key) console.info(`[assets] '${key}' 없음 → 절차적 폴백 사용`);
  });
  return key;
}

// 배경 배치: 텍스처가 있으면 cover, 없으면 단색 폴백
export function placeBg(scene, key, fallbackColor) {
  const { width, height } = scene.scale;
  if (scene.textures.exists(key)) {
    const img = scene.add.image(width / 2, height / 2, key).setDepth(-1000);
    const s = Math.max(width / img.width, height / img.height); // cover
    img.setScale(s);
    return img;
  }
  return scene.add.rectangle(0, 0, width, height, fallbackColor).setOrigin(0).setDepth(-1000);
}
