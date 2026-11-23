const menuButton = document.querySelector('.menu-button');
const navigation = document.getElementById('site-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});

const viewer = document.getElementById('photo-viewer');
if (viewer) {
  const items = [...document.querySelectorAll('[data-gallery-category]')];
  const filters = [...document.querySelectorAll('[data-gallery-filter]')];
  const photo = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  let visible = items;
  let current = 0;

  function showPhoto(index) {
    current = (index + visible.length) % visible.length;
    const link = visible[current].querySelector('[data-photo]');
    photo.src = link.href;
    photo.alt = link.dataset.photo;
    caption.textContent = `${link.dataset.photo} · ${current + 1} / ${visible.length}`;
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
      const category = filter.dataset.galleryFilter;
      for (const item of items) item.hidden = category !== 'ทั้งหมด' && item.dataset.galleryCategory !== category;
      visible = items.filter(item => !item.hidden);
    });
  }

  for (const item of items) {
    item.querySelector('[data-photo]').addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(visible.indexOf(item));
      viewer.showModal();
    });
  }
  for (const button of viewer.querySelectorAll('[data-gallery-step]')) {
    button.addEventListener('click', () => showPhoto(current + Number(button.dataset.galleryStep)));
  }
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
}

const form = document.getElementById('stay-form');
if (form) {
  const room = form.elements.room;
  const arrival = form.elements.arrival;
  const departure = form.elements.departure;
  const adults = form.elements.adults;
  const children = form.elements.children;
  const result = document.getElementById('message-result');
  const message = document.getElementById('stay-message');
  const goToLine = document.getElementById('open-line');
  const status = document.getElementById('copy-status');
  const formError = document.getElementById('form-error');
  const dateFormat = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateFromValue = value => new Date(`${value}T12:00:00`);
  const isoDay = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(n => String(n).padStart(2, '0')).join('-');
  const nextDay = value => {
    const date = dateFromValue(value);
    date.setDate(date.getDate() + 1);
    return isoDay(date);
  };
  const start = isoDay(new Date());
  arrival.min = start;
  departure.min = nextDay(start);

  const selectedRoom = new URLSearchParams(location.search).get('room');
  if ([...room.options].some(option => option.value === selectedRoom)) room.value = selectedRoom;

  arrival.addEventListener('change', () => {
    departure.min = nextDay(arrival.value || start);
    if (departure.value && departure.value < departure.min) departure.value = '';
  });

  form.addEventListener('input', () => {
    formError.textContent = '';
    result.hidden = true;
    goToLine.removeAttribute('href');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (arrival.value < start || departure.value <= arrival.value) {
      formError.textContent = 'กรุณาเลือกวันเช็กเอาต์หลังวันเช็กอิน และเลือกวันเข้าพักตั้งแต่วันนี้เป็นต้นไป';
      return;
    }
    const option = room.selectedOptions[0];
    const capacity = Number(option.dataset.guests || 4);
    if (Number(adults.value) + Number(children.value) > capacity) {
      formError.textContent = room.value ? `ห้องนี้พักได้สูงสุด ${capacity} คน กรุณาเปลี่ยนห้องหรือลดจำนวนผู้เข้าพัก` : 'แบบฟอร์มนี้รองรับสูงสุด 4 คนต่อห้อง';
      return;
    }

    message.value = [
      'สวัสดีค่ะ/ครับ ขอสอบถามห้องว่างที่วนาเวล เขาใหญ่',
      `ห้องที่สนใจ: ${room.value ? option.textContent : 'ขอคำแนะนำ'}`,
      `เช็กอิน: ${dateFormat.format(dateFromValue(arrival.value))}`,
      `เช็กเอาต์: ${dateFormat.format(dateFromValue(departure.value))}`,
      `ผู้เข้าพัก: ผู้ใหญ่ ${adults.value} คน เด็ก ${children.value} คน`,
      'รบกวนแจ้งห้องว่าง ราคา และเงื่อนไขการเข้าพักด้วยค่ะ/ครับ',
    ].join('\n');

    const account = form.dataset.lineId;
    if (account) goToLine.href = `https://line.me/R/oaMessage/${encodeURIComponent(account)}/?${encodeURIComponent(message.value)}`;
    goToLine.hidden = !account;
    status.textContent = '';
    result.hidden = false;
    document.getElementById('message-title').focus();
  });

  document.getElementById('copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'คัดลอกข้อความแล้ว';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'เลือกข้อความให้แล้ว กรุณาใช้คำสั่งคัดลอกของอุปกรณ์';
    }
  });
  form.inert = false;
}
