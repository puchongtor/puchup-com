for (const dialog of document.querySelectorAll('.lightbox')) {
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  dialog.previousElementSibling.addEventListener('click', event => {
    const photo = event.target.closest('[data-photo]');
    if (!photo || typeof dialog.showModal !== 'function') return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = photo.href;
    image.alt = photo.querySelector('img').alt;
    caption.textContent = image.alt;
    dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

const form = document.querySelector('[data-booking]');
if (form) {
  const { room, arrival, departure, adults, children } = form.elements;
  const error = form.querySelector('.form-error');
  const result = document.querySelector('.booking-result');
  const message = result.querySelector('textarea');
  const goToLine = result.querySelector('[data-line]');
  const status = result.querySelector('[data-status]');
  const account = form.dataset.lineId;
  const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' });
  const displayDate = new Intl.DateTimeFormat('th-TH', { dateStyle: 'long', timeZone: 'UTC' });
  const dateFromValue = value => new Date(value + 'T12:00:00Z');
  const tomorrowAfter = value => {
    const next = dateFromValue(value);
    next.setUTCDate(next.getUTCDate() + 1);
    return next.toISOString().slice(0, 10);
  };

  arrival.min = localDate.format(new Date());
  departure.min = tomorrowAfter(arrival.min);
  const query = new URLSearchParams(location.search);
  const selectedRoom = query.get('room');
  if (Array.from(room.options).some(option => option.value === selectedRoom)) room.value = selectedRoom;
  const selectedOffer = Array.from(form.querySelector('[data-offers]').content.children)
    .find(offer => offer.dataset.offer === query.get('offer'));
  const offerNote = form.querySelector('.selected-offer');
  function updateOffer() {
    const title = selectedOffer?.dataset.room === room.value ? selectedOffer.textContent : '';
    offerNote.hidden = !title;
    offerNote.textContent = title ? 'โปรที่สนใจ: ' + title : '';
    return title;
  }
  updateOffer();
  room.addEventListener('change', updateOffer);

  arrival.addEventListener('change', () => {
    departure.min = tomorrowAfter(arrival.value || arrival.min);
    if (departure.value < departure.min) departure.value = '';
  });

  form.addEventListener('input', () => {
    result.hidden = true;
    error.textContent = '';
    goToLine.removeAttribute('href');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (arrival.value < localDate.format(new Date()) || departure.value <= arrival.value) {
      error.textContent = 'เลือกวันเช็กอินตั้งแต่วันนี้ และวันเช็กเอาต์หลังวันเช็กอิน';
      return;
    }
    const selected = room.selectedOptions[0];
    const limit = Number(selected.dataset.guests);
    if (Number(adults.value) + Number(children.value) > limit) {
      error.textContent = `ห้องที่เลือกพักได้สูงสุด ${limit} คน กรุณาเปลี่ยนห้องหรือลดจำนวนผู้เข้าพัก`;
      return;
    }
    message.value = [
      'สวัสดีค่ะ/ครับ ขอสอบถามห้องว่างที่ Tamarind Tide Pranburi',
      'ห้องที่สนใจ: ' + selected.textContent,
      ...(updateOffer() ? [offerNote.textContent] : []),
      'เช็กอิน: ' + displayDate.format(dateFromValue(arrival.value)),
      'เช็กเอาต์: ' + displayDate.format(dateFromValue(departure.value)),
      `ผู้เข้าพัก: ผู้ใหญ่ ${adults.value} คน เด็ก ${children.value} คน`,
      'รบกวนแจ้งห้องว่าง ราคา และเงื่อนไขเข้าพักด้วยค่ะ/ครับ',
    ].join('\n');
    if (account) {
      goToLine.href = 'https://line.me/R/oaMessage/' + encodeURIComponent(account) + '/?' + encodeURIComponent(message.value);
      goToLine.hidden = false;
    }
    status.textContent = '';
    result.hidden = false;
    result.querySelector('h2').focus();
  });

  result.querySelector('[data-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'คัดลอกข้อความแล้ว';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'เลือกข้อความให้แล้ว ใช้คำสั่งคัดลอกของอุปกรณ์ได้เลย';
    }
  });
}
