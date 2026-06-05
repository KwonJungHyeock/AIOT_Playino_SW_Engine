import { coverIn, systemOnline, memoryFlicker } from './transitions.js';

// SCRIPT(데이터)를 읽어 채널로 렌더하는 서사 엔진. 새 에피소드 = SCRIPT 교체.
export default class StoryRunner {
  constructor({ scene, bus, comm, card, missions, script }) {
    Object.assign(this, { scene, bus, comm, card, missions, script });
  }

  _wait(ms) { return new Promise((r) => this.scene.time.delayedCall(ms, r)); }

  async run() {
    for (const beat of this.script) {
      await coverIn(this.scene);
      if (beat.type === 'cinematic') {
        await this.card.play({ lines: beat.lines, speaker: beat.speaker, bgColor: beat.bgColor });
        this.card.destroy();
      } else if (beat.type === 'memory') {
        await memoryFlicker(this.scene);
        await this.card.play({ lines: beat.lines, speaker: 'EDDIE' });
        this.card.destroy();
      } else if (beat.type === 'mission') {
        await this._runMission(beat);
      }
    }
    this.scene.events.emit('episode-complete');
  }

  async _runMission(beat) {
    // 1) 브리핑
    await this.card.play({ lines: [beat.briefing.objective, beat.briefing.eddie], speaker: 'EDDIE' });
    this.card.destroy();
    // 2) 플레이 (+ 통신 인터젝션)
    await new Promise((resolve) => {
      const interject = (at) => {
        const it = (beat.interjections || []).find((i) => i.at === at);
        if (it) this.comm.say(it.speaker, it.line);
      };
      const ctrl = this.missions[beat.mission]({
        scene: this.scene, bus: this.bus, comm: this.comm, interject,
        onComplete: () => { ctrl.destroy?.(); resolve(); },
      });
      this._ctrl = ctrl;
    });
    // 3) 디브리핑 (복구 연출 + 통신)
    await systemOnline(this.scene);
    for (const ln of beat.debrief) await this.comm.say(ln.speaker, ln.line);
    await this._wait(650);
    this.comm.setVisible(false);
  }
}
