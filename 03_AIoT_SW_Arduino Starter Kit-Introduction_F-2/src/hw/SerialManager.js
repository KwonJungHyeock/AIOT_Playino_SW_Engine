import Phaser from 'phaser';
import { parseLine, buildCommand } from './protocol.js';

// Web Serial 연결 관리 — 게임 씬과 분리된 독립 모듈(1번 확정 아키텍처).
// 씬은 events('data','open','close','error')만 구독한다.
// 지원: Chrome/Edge 데스크톱 + HTTPS/localhost. 연결은 사용자 클릭에서 요청.

export default class SerialManager extends Phaser.Events.EventEmitter {
  constructor({ baudRate = 115200 } = {}) {
    super();
    this.baudRate = baudRate;
    this.port = null;
    this.reader = null;
    this.writer = null;
    this._buf = '';
    this._reading = false;
  }

  static get isSupported() {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  // 반드시 사용자 제스처(버튼 클릭) 안에서 호출
  async connect() {
    if (!SerialManager.isSupported) {
      this.emit('error', new Error('이 브라우저는 Web Serial을 지원하지 않습니다 (Chrome/Edge 데스크톱 필요).'));
      return false;
    }
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: this.baudRate });
      const textDecoder = new TextDecoderStream();
      this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();
      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(this.port.writable);
      this.writer = textEncoder.writable.getWriter();
      this.emit('open');
      this._readLoop();
      return true;
    } catch (e) {
      this.emit('error', e);
      return false;
    }
  }

  async _readLoop() {
    this._reading = true;
    try {
      while (this._reading) {
        const { value, done } = await this.reader.read();
        if (done) break;
        this._buf += value;
        let idx;
        while ((idx = this._buf.indexOf('\n')) >= 0) {
          const line = this._buf.slice(0, idx);
          this._buf = this._buf.slice(idx + 1);
          const data = parseLine(line);
          if (data) this.emit('data', data);
        }
      }
    } catch (e) {
      this.emit('error', e);
    } finally {
      this.emit('close');
    }
  }

  // 게임 → 아두이노 명령 전송. 예) send('SERVO', 90)
  async send(cmd, ...args) {
    if (!this.writer) return;
    await this.writer.write(buildCommand(cmd, ...args));
  }

  async disconnect() {
    this._reading = false;
    try { await this.reader?.cancel(); } catch {}
    try { await this.writer?.close(); } catch {}
    try { await this.port?.close(); } catch {}
    this.reader = this.writer = this.port = null;
  }
}
