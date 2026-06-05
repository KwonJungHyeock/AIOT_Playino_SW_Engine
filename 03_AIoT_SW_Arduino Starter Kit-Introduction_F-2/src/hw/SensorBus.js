import Phaser from 'phaser';
import SimInput from './SimInput.js';

// 미션은 데이터 출처(실물 시리얼/시뮬)를 모른 채 bus.state만 읽는다.
// 실물 연결 시 SerialManager의 'data'(S:키=값)가 그대로 state에 병합된다.
export default class SensorBus extends Phaser.Events.EventEmitter {
  constructor(scene) {
    super();
    this.scene = scene;
    this.mode = 'sim';
    this.state = { dist: 60, tilt: 25, temp: 8, humi: 90, angle: 0, btn: 0 };
    this.sim = new SimInput(scene, this.state);
  }

  useSerial(serial) {
    this.mode = 'serial';
    serial.on('data', (d) => Object.assign(this.state, d));
    serial.on('close', () => { this.mode = 'sim'; this.emit('mode', 'sim'); });
    this.emit('mode', 'serial');
  }

  update(dt) {
    if (this.mode === 'sim') this.sim.update(dt);
  }
}
