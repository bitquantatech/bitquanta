/* Public examples: playback only; selecting a video never runs an inspection. */
'use strict';
document.querySelectorAll('[data-media-demo]').forEach(demo => {
  const video = demo.querySelector('video');
  const play = demo.querySelector('[data-demo-play]');
  const error = demo.querySelector('[data-demo-error]');
  demo.querySelectorAll('[data-demo-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.demoChoice;
      demo.querySelectorAll('[data-demo-choice]').forEach(choice => {
        choice.setAttribute('aria-pressed', String(choice === button));
      });
      demo.querySelectorAll('[data-demo-panel]').forEach(panel => {
        panel.hidden = panel.dataset.demoPanel !== selected;
      });
      if (selected !== 'video') video.pause();
    });
  });
  play.addEventListener('click', () => {
    error.hidden = true;
    video.play().catch(() => { error.hidden = false; });
  });
  video.addEventListener('play', () => { play.hidden = true; });
  video.addEventListener('pause', () => { play.hidden = false; });
  video.addEventListener('ended', () => { play.hidden = false; });
  video.addEventListener('error', () => { error.hidden = false; play.hidden = true; });
});
