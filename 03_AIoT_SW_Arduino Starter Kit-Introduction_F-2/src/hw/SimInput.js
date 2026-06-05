import Phaser from 'phaser';

// 하드웨어 없이 키보드로 센서값을 흉내. SensorBus(sim 모드)가 사용.
// dist↑↓ / tilt←→ / temp:W,S / humi:D,A / angle:E,Q / btn:Space
export default class SimInput {
  constructor(scene, state) {
    this.state = state;
    const k = scene.input.keyboard;
    this.keys = k.addKeys('UP,DOWN,LEFT,RIGHT,W,S,A,D,E,Q,SPACE');
  }

  update(dt) {
    const s = this.state;
    const r = dt / 1000;
    const K = this.keys;
    if (K.UP.isDown)    s.dist  = Phaser.Math.Clamp(s.dist - 60 * r, 0, 100);
    if (K.DOWN.isDown)  s.dist  = Phaser.Math.Clamp(s.dist + 60 * r, 0, 100);
    if (K.LEFT.isDown)  s.tilt  = Phaser.Math.Clamp(s.tilt - 70 * r, -45, 45);
    if (K.RIGHT.isDown) s.tilt  = Phaser.Math.Clamp(s.tilt + 70 * r, -45, 45);
    if (K.W.isDown)     s.temp  = Phaser.Math.Clamp(s.temp + 12 * r, 0, 40);
    if (K.S.isDown)     s.temp  = Phaser.Math.Clamp(s.temp - 12 * r, 0, 40);
    if (K.D.isDown)     s.humi  = Phaser.Math.Clamp(s.humi + 30 * r, 0, 100);
    if (K.A.isDown)     s.humi  = Phaser.Math.Clamp(s.humi - 30 * r, 0, 100);
    if (K.E.isDown)     s.angle = Phaser.Math.Clamp(s.angle + 90 * r, 0, 180);
    if (K.Q.isDown)     s.angle = Phaser.Math.Clamp(s.angle - 90 * r, 0, 180);
    s.btn = K.SPACE.isDown ? 1 : 0;
  }
}
