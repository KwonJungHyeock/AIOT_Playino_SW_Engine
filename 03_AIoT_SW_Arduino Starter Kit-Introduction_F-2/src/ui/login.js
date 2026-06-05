// DOM 오버레이 로그인: 8자리 클래스 코드 입력 (학생은 영구계정 없음)
// 스펙 §1: 네이티브 input이 필요한 곳은 DOM 오버레이(#overlay) 사용

export function showLogin({ onSubmit } = {}) {
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';

  const pane = document.createElement('div');
  pane.className = 'pane login-card';
  pane.innerHTML = `
    <h2>ACCESS CODE</h2>
    <p>선생님께 받은 8자리 클래스 코드를 입력하세요</p>
    <input id="class-code" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="········" />
    <div class="err" id="code-err"></div>
    <button id="code-go">접속</button>
  `;
  overlay.appendChild(pane);

  const input = pane.querySelector('#class-code');
  const err = pane.querySelector('#code-err');
  const go = pane.querySelector('#code-go');
  input.focus();

  const submit = () => {
    const code = input.value.trim();
    if (!/^\d{8}$/.test(code)) {
      err.textContent = '8자리 숫자 코드를 정확히 입력하세요.';
      return;
    }
    err.textContent = '';
    onSubmit?.(code);
  };

  go.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
}

export function hideLogin() {
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.innerHTML = '';
}
