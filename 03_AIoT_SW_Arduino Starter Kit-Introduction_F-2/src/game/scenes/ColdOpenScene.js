import Phaser from 'phaser';
import { BASE, NUM, COLORS, FONTS, SCENES } from '../../shared/theme.js';
import { placeBg } from '../assets.js';
import { fadeIn, goTo } from '../fx/transition.js';
import { addVignette, ensureGlow } from '../fx/textures.js';
import Eddie from '../objects/Eddie.js';
import * as sfx from '../fx/sfx.js';

// 콜드오픈: 어둠 속에서 깨어난 EDDIE를 플레이어가 직접 조작해
// 복도 끝 콘솔까지 걸어가 시스템을 부팅 → 에피소드(SOS) 시작. (CH1 '각성')
export default class ColdOpenScene extends Phaser.Scene {
  constructor() { super(SCENES.COLDOPEN); }

  create(data) {
    this.classCode = data?.classCode;
    this.activated = false;
    this.speed = 330;
    this.startX = 160;
    this.consoleX = 1130;
    const floorY = 560;

    fadeIn(this);
    placeBg(this, 'coldopen-bg', NUM.bg);
    addVignette(this, 8000);

    // EDDIE: 측면 스프라이트 우선, 없으면 절차적 폴백
    if (this.textures.exists('eddie_side')) {
      this.eddie = this.add.image(this.startX, floorY, 'eddie_side').setOrigin(0.5, 1);
      this.eddie.setScale(220 / this.eddie.height);
      this.eddieBaseY = floorY;
      this.bodyY = floorY - 100;
      this.eddieIsSprite = true;
    } else {
      this.eddie = new Eddie(this, this.startX, floorY - 90, 0.95);
      this.eddieBaseY = floorY - 90;
      this.bodyY = floorY - 90;
      this.eddieIsSprite = false;
    }
    this.eddie.setDepth(8600);

    // 바이저 글로우 — 어둠 속 유일한 빛, EDDIE를 따라다님 (비네트 위)
    this.glow = this.add.image(this.startX, this.bodyY, ensureGlow(this))
      .setBlendMode(Phaser.BlendModes.ADD).setTint(NUM.eddie).setAlpha(0.32).setScale(3.6).setDepth(8500);
    // 콘솔(해치) 활성 글로우 — 도달 시 점등
    this.hatchGlow = this.add.image(this.consoleX + 70, this.bodyY, ensureGlow(this))
      .setBlendMode(Phaser.BlendModes.ADD).setTint(NUM.amber).setAlpha(0).setScale(2.8).setDepth(8500);

    // UI
    this.cap = this.add.text(BASE.w / 2, 84, '', { fontFamily: FONTS.kr, fontSize: '20px', color: COLORS.text, align: 'center' })
      .setOrigin(0.5).setDepth(82000).setAlpha(0);
    this.hint = this.add.text(BASE.w / 2, BASE.h - 38, '← →  이동        Space  작동', { fontFamily: FONTS.kr, fontSize: '15px', color: COLORS.info })
      .setOrigin(0.5).setDepth(82000).setAlpha(0);
    this.prompt = this.add.text(this.consoleX, this.bodyY - 110, '[ Space ] 시스템 부팅', { fontFamily: FONTS.display, fontSize: '18px', color: COLORS.eddie })
      .setOrigin(0.5).setDepth(82000).setAlpha(0);

    // 인트로 연출
    this._caption('…부팅 완료. 비상 전력만 남았다.');
    this.time.delayedCall(2400, () => { if (!this.activated) this._caption('어둠 속 콘솔로 다가가 정거장을 깨워라.'); });
    this.tweens.add({ targets: this.hint, alpha: 0.9, duration: 600, delay: 1000 });

    // 입력
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard.on('keydown-SPACE', this._tryActivate, this);
    this.input.keyboard.on('keydown-ENTER', this._tryActivate, this);
    // 포인터(터치/마우스): 누른 쪽으로 이동
    this.pointerTarget = null;
    this.input.on('pointerdown', (p) => { this.pointerTarget = p.worldX; });
    this.input.on('pointermove', (p) => { if (p.isDown) this.pointerTarget = p.worldX; });
    this.input.on('pointerup', () => { this.pointerTarget = null; });

    this.events.once('shutdown', () => this._cleanup());
  }

  _caption(text) {
    this.cap.setText(text).setAlpha(0);
    this.tweens.add({ targets: this.cap, alpha: 1, duration: 500 });
  }

  update(time, dt) {
    if (this.activated) return;
    let dir = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) dir = -1;
    else if (this.cursors.right.isDown || this.keyD.isDown) dir = 1;
    else if (this.pointerTarget != null && Math.abs(this.pointerTarget - this.eddie.x) > 10) dir = Math.sign(this.pointerTarget - this.eddie.x);

    if (dir !== 0) {
      this.eddie.x = Phaser.Math.Clamp(this.eddie.x + dir * this.speed * (dt / 1000), this.startX, this.consoleX);
      if (this.eddieIsSprite) this.eddie.setFlipX(dir < 0);
      this.walkT = (this.walkT || 0) + dt;
      this.eddie.y = this.eddieBaseY + Math.sin(this.walkT / 85) * 4; // 워크 보브
    } else {
      this.eddie.y = this.eddieBaseY;
    }
    this.glow.x = this.eddie.x;

    const inRange = (this.consoleX - this.eddie.x) < 130;
    if (inRange !== this._inRange) {
      this._inRange = inRange;
      this.tweens.add({ targets: this.hatchGlow, alpha: inRange ? 0.4 : 0, duration: 250 });
      this.tweens.add({ targets: this.prompt, alpha: inRange ? 1 : 0, duration: 250 });
    }
    if (inRange) this.prompt.setScale(1 + 0.05 * Math.sin(time / 180));
  }

  _tryActivate() {
    if (this.activated || !this._inRange) return;
    this.activated = true;
    this.pointerTarget = null;
    this.tweens.add({ targets: [this.hint, this.prompt], alpha: 0, duration: 200 });
    if (this.eddieIsSprite) { this.eddie.setFlipX(false); this.eddie.y = this.eddieBaseY; }
    this._caption('메인 시스템 기동…  신호가 잡힌다.');

    // 부팅 연출: 해치 점등 + 사운드 + 흔들림 + 청록 플래시
    this.tweens.add({ targets: this.hatchGlow, alpha: 0.95, scale: 5.5, duration: 520, ease: 'Quad.out' });
    this.tweens.add({ targets: this.glow, alpha: 0.6, scale: 4.6, duration: 520, yoyo: true });
    sfx.chime();
    const h = sfx.hum({ baseFreq: 80, topFreq: 240 });
    h.setLevel(1);
    this.time.delayedCall(700, () => h.stop());
    this.cameras.main.shake(320, 0.005);
    this.cameras.main.flash(280, 60, 255, 214);

    this.time.delayedCall(900, () => goTo(this, SCENES.EPISODE, { classCode: this.classCode }));
  }

  _cleanup() {
    this.input.keyboard.off('keydown-SPACE', this._tryActivate, this);
    this.input.keyboard.off('keydown-ENTER', this._tryActivate, this);
    this.input.removeAllListeners();
  }
}
