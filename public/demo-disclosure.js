(() => {
  const script = document.currentScript;
  const explicit = '[data-puchup-demo-action]';
  const controlSelector = script?.dataset.explicitOnly === 'true' ? explicit : `${explicit}, a[href], button, input[type="submit"]`;
  const bookingPath = /(?:^|[/#])(?:booking|book|reserve|reservation|appointment|inquire|request|quote|order)(?:[/#?]|$)/i;
  const bookingLabel = /จอง|นัด|เช็กห้องว่าง|ตรวจสอบห้องว่าง|สอบถามห้องว่าง|เช็กห้องนี้ว่าง|สอบถามโปรนี้|ขอราคา|ใบเสนอราคา|เตรียมข้อความ|สร้างข้อความ|\b(?:book now|reserve|make an appointment|request a quote)\b/i;
  let nextId = 0;
  let frame = 0;
  const notes = new Map();
  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(document.body);

  const stylesheetUrl = new URL('demo-disclosure.css', script?.src || location.href).href;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === stylesheetUrl)) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = stylesheetUrl;
    stylesheet.addEventListener('load', schedule);
    document.head.append(stylesheet);
  }

  function annotate(control) {
    if (notes.has(control) || control.matches('.puchup-demo-current-button') || control.closest('.puchup-demo-ribbon')) return;
    const label = control.getAttribute('aria-label') || control.value || control.textContent;
    const href = control.getAttribute('href') || '';
    const form = control.form;
    const submitsBooking = form && control.type === 'submit' &&
      Boolean(form.closest('#booking, #quote, #order, [data-booking], [data-request], [id*="book"], [id*="inquir"]'));
    const opensBookingMessage = control.matches('#line-link, #open-line, [data-booking-line]');
    if (!control.matches(explicit) && (href === '#location' || (!bookingLabel.test(label) && !bookingPath.test(href) && !submitsBooking && !opensBookingMessage))) return;

    const note = document.createElement('small');
    note.id = `puchup-demo-note-${++nextId}`;
    note.className = 'puchup-demo-note';
    note.style.position = 'fixed';
    note.hidden = true;
    note.textContent = '(เว็บตัวอย่าง)';
    const description = control.getAttribute('aria-describedby');
    control.setAttribute('aria-describedby', description ? `${description} ${note.id}` : note.id);

    const style = getComputedStyle(control);
    const topPadding = parseFloat(style.paddingTop);
    const bottomPadding = parseFloat(style.paddingBottom);
    const hasButtonSurface = style.backgroundImage !== 'none' ||
      !['transparent', 'rgba(0, 0, 0, 0)'].includes(style.backgroundColor) || parseFloat(style.borderTopWidth) > 0;
    if (!control.matches('input') && hasButtonSurface && topPadding >= 4 && topPadding + bottomPadding >= 11) {
      const lift = Math.min(5, topPadding);
      control.style.setProperty('--demo-button-top', `${topPadding - lift}px`);
      control.style.setProperty('--demo-button-bottom', `${bottomPadding + lift}px`);
      control.classList.add('puchup-demo-current-button');
      if (style.position === 'static') control.classList.add('puchup-demo-button-anchor');
      if (style.backgroundImage === 'none') control.classList.add('puchup-demo-button-surface');
      note.classList.add('puchup-demo-note-inside');
      note.style.removeProperty('position');
      note.removeAttribute('hidden');
      note.setAttribute('aria-hidden', 'true');
      control.append(note);
      return;
    }

    (control.closest('dialog') || document.body).append(note);
    notes.set(control, note);
    resizeObserver.observe(control);
    schedule();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(placeNotes);
  }

  function buttonContentBoxes(control) {
    const boxes = [...control.querySelectorAll('svg, img')].map(element => element.getBoundingClientRect());
    const text = document.createTreeWalker(control, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (text.nextNode()) {
      if (!text.currentNode.textContent.trim()) continue;
      range.selectNodeContents(text.currentNode);
      boxes.push(...range.getClientRects());
    }
    return boxes;
  }

  function placeNotes() {
    frame = 0;
    const viewport = document.documentElement;
    const placed = [];
    for (const [control, note] of notes) {
      if (!control.isConnected) {
        resizeObserver.unobserve(control);
        note.remove();
        notes.delete(control);
        continue;
      }
      const rect = control.getBoundingClientRect();
      const center = document.elementFromPoint((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
      if (!rect.width || !rect.height || !control.contains(center) || control.checkVisibility?.({checkOpacity: true, checkVisibilityCSS: true}) === false) {
        note.hidden = true;
        continue;
      }

      note.hidden = false;
      const width = note.offsetWidth;
      const height = note.offsetHeight;
      const middleX = rect.left + (rect.width - width) / 2;
      const middleY = rect.top + (rect.height - height) / 2;
      const candidates = [
        [middleX, rect.bottom + 2],
        [rect.right + 5, middleY],
        [rect.left - width - 5, middleY],
        [middleX, rect.top - height - 2],
      ];
      const fits = ([x, y]) => {
        if (x < 2 || y < 2 || x + width > viewport.clientWidth - 2 || y + height > viewport.clientHeight - 2) return false;
        return !placed.some(box => x < box.right && x + width > box.left && y < box.bottom && y + height > box.top);
      };
      let position = candidates.find(([x, y]) => {
        if (!fits([x, y])) return false;
        return [1, width / 2, width - 1].every(dx => [1, height - 1].every(dy => {
          const surface = document.elementFromPoint(x + dx, y + dy);
          return surface && surface !== control && surface.contains(control);
        }));
      });
      if (!position && rect.width >= width + 12 && rect.height >= height * 2 && !control.matches('input')) {
        const content = buttonContentBoxes(control);
        position = [[middleX, rect.bottom - height - 2], [middleX, rect.top + 2]].find(([x, y]) =>
          fits([x, y]) && content.every(box => x + width + 1 <= box.left || x - 1 >= box.right || y + height + 1 <= box.top || y - 1 >= box.bottom),
        );
      }
      if (!position) {
        note.hidden = true;
        continue;
      }
      const [left, top] = position;
      note.style.left = `${left}px`;
      note.style.top = `${top}px`;
      note.style.color = getComputedStyle(document.elementFromPoint(left + width / 2, top + height / 2)).color;
      placed.push({left, top, right: left + width, bottom: top + height});
    }
  }

  function scan(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches(controlSelector)) annotate(root);
    root.querySelectorAll(controlSelector).forEach(annotate);
  }

  scan(document.body);
  window.addEventListener('scroll', schedule, {capture: true, passive: true});
  window.addEventListener('resize', schedule);
  document.addEventListener('transitionend', schedule);
  document.addEventListener('load', schedule, true);
  document.fonts?.ready.then(schedule);
  new MutationObserver(records => {
    for (const record of records) {
      const changedControl = record.target.closest?.(controlSelector);
      if (changedControl) annotate(changedControl);
      for (const node of record.addedNodes) scan(node);
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
})();
