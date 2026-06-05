import Phaser from 'phaser';
import { SCENES } from '../../shared/theme.js';

// 초기 설정만. 무거운 로드는 Preload에서.
export default class BootScene extends Phaser.Scene {
  constructor() { super(SCENES.BOOT); }
  create() {
    this.scene.start(SCENES.PRELOAD);
  }
}
