// 통신 프로토콜 규약 (1번에서 확정)
//   아두이노 → 웹 (센서):  S:키=값,키=값\n     예) S:dist=42,tilt=15,btn=1
//   웹 → 아두이노 (명령):  C:명령[:인자]\n     예) C:SERVO:90 / C:LED_ON
// 모든 줄은 개행(\n)으로 종료.

export function parseLine(line) {
  const s = line.trim();
  if (!s.startsWith('S:')) return null;
  const out = {};
  for (const pair of s.slice(2).split(',')) {
    const [k, v] = pair.split('=');
    if (!k) continue;
    const n = Number(v);
    out[k.trim()] = Number.isFinite(n) ? n : v;
  }
  return out; // { dist:42, tilt:15, btn:1 }
}

export function buildCommand(cmd, ...args) {
  return `C:${[cmd, ...args].join(':')}\n`;
}
