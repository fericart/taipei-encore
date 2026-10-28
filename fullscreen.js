// Keep the existing player and source dialogs in the same document while the
// stage fills the screen. Restricted iframes/mobile browsers get a viewport fit.
export function initFullscreen() {
  const stage = document.querySelector('#stage');
  const button = document.querySelector('#fullscreen');
  const root = document.documentElement;
  const hint = document.querySelector('#fullscreen-hint');
  const current = () => document.fullscreenElement || document.webkitFullscreenElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  let active = false;
  let native = false;
  let scroll = [0, 0];
  let background = [];

  function setActive(value) {
    if (active === value) return;
    active = value;
    if (value) {
      scroll = [window.scrollX, window.scrollY];
      // Prevent keyboard focus from moving into content behind the full stage.
      for (let node = stage; node.parentElement; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling === node || sibling.matches('dialog,#music-panel,#toast,script,style,link')) continue;
          background.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
    } else {
      background.forEach(([node, inert]) => { node.inert = inert; });
      background = [];
    }
    root.classList.toggle('stage-fullscreen', value);
    stage.dataset.fullscreen = value ? 'viewport' : 'off';
    button.setAttribute('aria-pressed', String(value));
    button.setAttribute('aria-label', value ? '退出全螢幕' : '全螢幕');
    button.title = value ? '退出全螢幕（Esc）' : '全螢幕';
    button.querySelector('span').textContent = value ? '退出' : '全螢幕';
    hint.hidden = !value;
    hint.textContent = '滿版舞台 · 再按全螢幕鍵退出';
    if (!value) {
      native = false;
      window.scrollTo({left: scroll[0], top: scroll[1], behavior: 'instant'});
      button.focus({preventScroll: true});
    }
  }

  function syncNative() {
    if (current() === root && active) {
      native = true;
      stage.dataset.fullscreen = 'native';
      hint.textContent = '全螢幕 · Esc 或右側按鈕退出';
    } else if (native) setActive(false);
  }

  async function leave() {
    if (current() === root && exit) {
      try { await exit.call(document); }
      catch { hint.textContent = '請使用瀏覽器的全螢幕控制退出'; return; }
    }
    if (current() !== root) setActive(false);
  }

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      if (active) {
        await leave();
      } else {
        setActive(true);
        if (request && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
          try { await request.call(root); } catch { /* Keep the viewport fallback. */ }
          syncNative();
        }
      }
    } finally {
      button.disabled = false;
    }
  });
  document.addEventListener('fullscreenchange', syncNative);
  document.addEventListener('webkitfullscreenchange', syncNative);
  document.addEventListener('keydown', event => {
    // A policy dialog gets the first Escape; the next exits the full stage.
    if (event.key === 'Escape' && active && !document.querySelector('dialog[open]')) {
      event.preventDefault();
      void leave();
    }
  });
}
