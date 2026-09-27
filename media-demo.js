/* Illustrative marketing walkthrough; its display score is staged and playback never runs inference. */
'use strict';
document.querySelectorAll('[data-media-demo]').forEach(demo => {
  const video = demo.querySelector('video');
  const play = demo.querySelector('[data-demo-play]');
  const error = demo.querySelector('[data-demo-error]');
  const intro = demo.querySelector('[data-demo-intro]');
  const outro = demo.querySelector('[data-demo-outro]');
  let finished = false;
  let playbackRequest = 0;
  const showResult = ended => {
    finished = ended;
    // Keep the end card unobscured; the visible replay button restores controls.
    video.controls = !ended;
    intro.hidden = ended;
    outro.hidden = !ended;
    play.hidden = ended || !video.paused;
  };
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
    const request = ++playbackRequest;
    error.hidden = true;
    video.play().catch(() => {
      if (request !== playbackRequest) return;
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
    video.currentTime = 0;
    showResult(false);
    // Keep keyboard focus on a visible control when the outro disappears.
    video.focus({ preventScroll: true });
    startPlayback();
  });
  video.addEventListener('play', () => {
    showResult(false);
  });
  video.addEventListener('pause', () => { play.hidden = finished || video.ended; });
  video.addEventListener('ended', () => {
    // The clip includes the close-up and result. Retain its actual final frame.
    showResult(true);
  });
  video.addEventListener('seeking', () => {
    if (finished && video.currentTime < video.duration - 0.1) showResult(false);
  });
  video.addEventListener('error', () => { error.hidden = false; play.hidden = true; });

  // Localize the in-video copy as well as the page, retaining the user's position.
  let activeLanguage = 'en';
  let resumeState = null;
  const syncLanguage = () => {
    const language = document.documentElement.lang === 'tr' ? 'tr' : 'en';
    if (language === activeLanguage) return;
    const state = resumeState || {
      time: video.currentTime,
      ended: finished || video.ended,
      playing: !video.paused
    };
    activeLanguage = language;
    resumeState = state;
    ++playbackRequest;
    video.pause();
    video.poster = video.dataset[language === 'tr' ? 'posterTr' : 'posterEn'];
    video.src = video.dataset[language === 'tr' ? 'srcTr' : 'srcEn'];
    if (state.time > 0 || state.playing || state.ended) video.preload = 'auto';
    error.hidden = true;
    video.load();
  };
  video.addEventListener('loadedmetadata', () => {
    if (!resumeState) return;
    const state = resumeState;
    resumeState = null;
    video.currentTime = state.ended ? video.duration : Math.min(state.time, video.duration);
    showResult(state.ended);
    if (state.playing && !state.ended) startPlayback();
  });
  new MutationObserver(syncLanguage).observe(document.documentElement, {
    attributes: true, attributeFilter: ['lang']
  });
  syncLanguage();
});
