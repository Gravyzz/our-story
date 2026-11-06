'use strict';
(() => {
  const galleries = window.storyPhotos;
  const names = { fujairah: 'Фуджейра', march: 'Март · Нижний Новгород', summer: 'Лето · Томск', october: 'Октябрь · Нижний Новгород' };
  const captions = {
    'fujairah-img_3293.jpg': 'Тот самый волейбол',
    'fujairah-img_3310.jpg': 'Наш первый рассвет',
    'fujairah-img_3406.jpg': 'Маленькие моменты рядом',
    'fujairah-img_3422.jpg': 'Там, где начались мы',
    'fujairah-img_3625.jpg': 'Фуджейра, которую я помню',
    'march-img_4453.jpg': 'Мы снова вместе',
    'march-img_4642.jpg': 'Мартовские вечера',
    'march-img_4496.jpg': 'Неделя рядом с тобой',
    'march-img_4618.jpg': 'Самые важные мелочи',
    'summer-img_6387.jpg': 'Наше лето',
    'summer-img_6501.jpg': 'Вечера, которые хочется повторить',
    'summer-img_6710.jpg': 'Обычный счастливый день',
    'summer-img_7022.jpg': 'И немного наших глупостей',
    'summer-img_6368.jpg': 'Лето в Томске',
    'summer-img_6556.jpg': 'Наши домашние вечера',
    'october-img_7710.jpg': 'Наша октябрьская встреча',
    'october-img_7697.jpg': 'Снова рядом',
    'october-img_7769.jpg': 'И снова к тебе'
  };
  const lightbox = document.getElementById('lightbox');
  const mainPhoto = document.getElementById('lightboxImage');
  const thumbnails = document.getElementById('thumbnailStrip');
  let chapter = 'fujairah';
  let currentIndex = 0;
  let previousFocus = null;
  let previousOverflow = '';

  function captionFor(src) { return captions[src.split('/').pop()] || names[chapter]; }
  function showPhoto(index) {
    const photos = galleries[chapter];
    currentIndex = (index + photos.length) % photos.length;
    const src = photos[currentIndex];
    mainPhoto.src = src;
    mainPhoto.alt = captionFor(src);
    document.getElementById('lightboxCount').textContent = `${currentIndex + 1} / ${photos.length}`;
    document.getElementById('lightboxCaption').textContent = captionFor(src);
    [...thumbnails.children].forEach((button, i) => {
      button.setAttribute('aria-current', String(i === currentIndex));
      if (i === currentIndex) button.scrollIntoView({block:'nearest', inline:'center', behavior:'auto'});
    });
  }
  function openGallery(key, index = 0) {
    if (!galleries[key]) return;
    chapter = key;
    previousFocus = document.activeElement;
    document.getElementById('galleryTitle').textContent = names[key];
    thumbnails.replaceChildren();
    galleries[key].forEach((src, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Фото ${i + 1}: ${captionFor(src)}`);
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      button.append(img);
      button.addEventListener('click', () => showPhoto(i));
      thumbnails.append(button);
    });
    lightbox.showModal();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    showPhoto(index);
    document.getElementById('closeLightbox').focus();
  }
  document.querySelectorAll('[data-photo]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const [key, index] = link.dataset.photo.split(':');
      openGallery(key, Number(index));
    });
  });
  document.querySelectorAll('[data-album]').forEach(button => {
    button.addEventListener('click', () => openGallery(button.dataset.album));
  });
  document.getElementById('closeLightbox').addEventListener('click', () => lightbox.close());
  document.getElementById('prevPhoto').addEventListener('click', () => showPhoto(currentIndex - 1));
  document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(currentIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    previousFocus?.focus({preventScroll:true});
  });
  document.addEventListener('keydown', event => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentIndex + 1); }
  });
  let touchStart = null;
  mainPhoto.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = [event.touches[0].clientX, event.touches[0].clientY];
  }, {passive:true});
  mainPhoto.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart[0];
    const dy = event.changedTouches[0].clientY - touchStart[1];
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(currentIndex + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});

  const details = document.getElementById('letterDetails');
  const shower = document.getElementById('flowerShower');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let firstLetterOpen = true;
  let cleanupTimer;
  function flowers() {
    if (reducedMotion.matches) return;
    shower.replaceChildren();
    clearTimeout(cleanupTimer);
    for (let i = 0; i < 22; i++) {
      const rose = document.createElement('img');
      rose.src = 'assets/rose-bloom.webp';
      rose.alt = '';
      rose.className = 'falling-rose';
      rose.style.left = `${-2 + Math.random() * 104}%`;
      rose.style.setProperty('--size', `${25 + Math.random() * 33}px`);
      rose.style.setProperty('--duration', `${4 + Math.random() * 1.8}s`);
      rose.style.setProperty('--delay', `${Math.random() * .9}s`);
      rose.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
      rose.style.setProperty('--turn', `${-230 + Math.random() * 460}deg`);
      rose.addEventListener('animationend', () => rose.remove(), {once:true});
      shower.append(rose);
    }
    cleanupTimer = setTimeout(() => shower.replaceChildren(), 7000);
  }
  details.addEventListener('toggle', () => {
    document.getElementById('letterAction').textContent = details.open ? 'С ЛЮБОВЬЮ, ДЛЯ ТЕБЯ' : 'КОСНИСЬ, ЧТОБЫ ОТКРЫТЬ';
    if (details.open) {
      if (firstLetterOpen) { flowers(); firstLetterOpen = false; }
      details.scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth', block:'start'});
    }
    updateProgress();
  });
  document.getElementById('moreFlowers').addEventListener('click', flowers);
  const progress = document.getElementById('progress');
  let scheduled = false;
  function updateProgress() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${distance > 0 ? Math.min(100, Math.max(0, window.scrollY / distance * 100)) : 0}%`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  updateProgress();
})();
