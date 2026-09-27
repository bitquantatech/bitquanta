/* Illustrative marketing walkthrough; its display score is staged and playback never runs inference. */
'use strict';
document.querySelectorAll('[data-media-demo]').forEach(demo => {
  const video = demo.querySelector('video');
  const play = demo.querySelector('[data-demo-play]');
  const error = demo.querySelector('[data-demo-error]');
  const intro = demo.querySelector('[data-demo-intro]');
  const outro = demo.querySelector('[data-demo-outro]');
  const focusView = demo.querySelector('[data-demo-focus]');
  const setZoom = zoomed => {
    focusView.classList.toggle('is-zoomed', zoomed);
    demo.querySelectorAll('[data-demo-zoom]').forEach(button => {
      button.setAttribute('aria-pressed', String((button.dataset.demoZoom === 'in') === zoomed));
    });
  };
  demo.querySelectorAll('[data-demo-zoom]').forEach(button => {
    button.addEventListener('click', () => setZoom(button.dataset.demoZoom === 'in'));
  });
  const panel = demo.querySelector('[data-demo-panel="video"]');
  const dialog = demo.querySelector('[data-demo-dialog]');
  const expand = demo.querySelector('[data-demo-expand]');
  let closeFocus = expand;
  // Move the same player into the dialog, retaining its playback position.
  const inlinePosition = document.createComment('inline video position');
  panel.before(inlinePosition);
  const selectPanel = selected => {
    demo.querySelectorAll('[data-demo-choice]').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice.dataset.demoChoice === selected));
    });
    demo.querySelectorAll('[data-demo-panel]').forEach(panel => {
      panel.hidden = panel.dataset.demoPanel !== selected;
    });
    if (selected !== 'video') video.pause();
  };
  const startPlayback = () => {
    error.hidden = true;
    video.play().catch(() => {
      error.hidden = false;
      play.hidden = false;
    });
  };
  demo.querySelectorAll('[data-demo-choice]').forEach(button => {
    button.addEventListener('click', () => selectPanel(button.dataset.demoChoice));
  });
  expand.addEventListener('click', () => {
    const wasPlaying = !video.paused;
    dialog.append(panel);
    dialog.showModal();
    if (wasPlaying) startPlayback();
  });
  demo.querySelector('[data-demo-close]').addEventListener('click', () => dialog.close());
  // A contact link must leave the enlarged player before scrolling to the form.
  demo.querySelector('.demo-try-cta').addEventListener('click', () => {
    const contactHeading = document.querySelector('#contact h2');
    if (contactHeading) {
      contactHeading.tabIndex = -1;
      closeFocus = contactHeading;
    }
    if (dialog.open) dialog.close();
    else {
      const destination = closeFocus;
      requestAnimationFrame(() => destination.focus({ preventScroll: true }));
      closeFocus = expand;
    }
    video.pause();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    inlinePosition.after(panel);
    closeFocus.focus({ preventScroll: true });
    closeFocus = expand;
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  play.addEventListener('click', startPlayback);
  demo.querySelector('[data-demo-replay]').addEventListener('click', () => {
    focusView.hidden = true;
    video.hidden = false;
    video.currentTime = 0;
    // Keep keyboard focus on a visible control when the outro disappears.
    video.focus({ preventScroll: true });
    startPlayback();
  });
  video.addEventListener('play', () => {
    video.hidden = false;
    focusView.hidden = true;
    setZoom(false);
    intro.hidden = false;
    outro.hidden = true;
    play.hidden = true;
  });
  video.addEventListener('pause', () => { play.hidden = !outro.hidden || video.ended; });
  video.addEventListener('ended', () => {
    video.hidden = true;
    focusView.hidden = false;
    // Paint the exact ending frame before animating the close-up, including replays.
    setZoom(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!focusView.hidden) setZoom(true);
    }));
    intro.hidden = true;
    outro.hidden = false;
    play.hidden = true;
  });
  video.addEventListener('error', () => { error.hidden = false; play.hidden = true; });
});
