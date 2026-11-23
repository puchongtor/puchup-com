const query = new URLSearchParams(location.search);
const toggle = document.querySelector('#menu-toggle');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'false';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    toggle.click();
    toggle.focus();
  }
});

function assign(select, value) {
  if (Array.from(select.options).some(option => option.value === value)) select.value = value;
}

const filters = document.querySelector('#filters');
if (filters) {
  const fields = Array.from(filters.querySelectorAll('select'));
  const rows = Array.from(document.querySelectorAll('tbody tr'));
  const status = document.querySelector('#schedule-status');
  for (const field of fields) assign(field, query.get(field.name));
  function filterSchedule() {
    let shown = 0;
    for (const row of rows) {
      row.hidden = !fields.every(field => !field.value || row.dataset[field.name] === field.value);
      if (!row.hidden) shown += 1;
    }
    status.textContent = shown ? 'พบ '+shown+' รอบ' : 'ไม่พบรอบที่ตรงกัน ลองเปลี่ยนตัวกรอง';
  }
  filters.addEventListener('change', filterSchedule);
  filterSchedule();
}

const form = document.querySelector('#booking');
if (form) {
  const { branches, classes, coaches, sessions, days, oa } = JSON.parse(document.querySelector('#book-data').textContent);
  const { branch, class: type, slot, date, nickname, people } = form.elements;
  const draft = document.querySelector('#draft');
  const message = document.querySelector('#message');
  const lineLink = document.querySelector('#line-link');
  const hint = document.querySelector('#booking-hint');
  const status = document.querySelector('#copy-status');
  const bangkok = new Intl.DateTimeFormat('en-CA', { year:'numeric', month:'2-digit', day:'2-digit', timeZone:'Asia/Bangkok' });
  const thaiDay = new Intl.DateTimeFormat('th-TH', { dateStyle:'long', timeZone:'UTC' });
  function today() { return bangkok.format(new Date()); }
  date.min = today();
  const selected = sessions.find(s => s.id === query.get('slot'));
  assign(branch, selected?.branch || query.get('branch'));
  assign(type, selected?.type || query.get('class'));

  function refreshSlots(initialSlot = slot.value) {
    const eligible = sessions.filter(s => (!branch.value || branch.value === s.branch) && (!type.value || type.value === s.type));
    slot.replaceChildren(new Option(eligible.length ? 'เลือกรอบ' : 'ไม่มีรอบที่ตรงกับตัวเลือก', ''));
    for (const s of eligible) {
      slot.add(new Option('วัน'+days[s.day]+' '+s.time+' · '+classes[s.type].name+' · '+branches[s.branch].name, s.id));
    }
    assign(slot, initialSlot);
    people.options[1].disabled = type.value !== 'private';
    if (people.options[1].disabled) people.value = '1';
    const active = sessions.find(s => s.id === slot.value);
    hint.textContent = active ? 'เลือกรอบวัน'+days[active.day]+' กับ'+coaches[active.coach].name+' และระบุวันที่ตรงกับวันในตาราง' : eligible.length ? 'มี '+eligible.length+' รอบให้เลือก' : 'ลองเปลี่ยนสาขาหรือคลาส';
    date.setCustomValidity('');
  }
  refreshSlots(selected?.id);
  form.addEventListener('input', () => {
    draft.hidden = true;
    nickname.setCustomValidity('');
    date.setCustomValidity('');
  });
  branch.addEventListener('change', () => refreshSlots());
  type.addEventListener('change', () => refreshSlots());
  slot.addEventListener('change', () => {
    const active = sessions.find(s => s.id === slot.value);
    if (active) {
      assign(branch, active.branch);
      assign(type, active.type);
    }
    refreshSlots();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const active = sessions.find(s => s.id === slot.value);
    if (!active) { slot.reportValidity(); return; }
    if (!nickname.value.trim()) {
      nickname.setCustomValidity('โปรดระบุชื่อเล่น');
      nickname.reportValidity();
      return;
    }
    const visit = new Date(date.value+'T00:00:00Z');
    if (visit.getUTCDay() !== active.day || date.value < today()) {
      date.setCustomValidity('เลือกวัน'+days[active.day]+' ตั้งแต่วันนี้เป็นต้นไป');
      date.reportValidity();
      return;
    }
    const lines = [
      'สวัสดีค่ะ/ครับ สนใจขอจองคลาส Stillform Pilates',
      'ชื่อเล่น '+nickname.value.trim(),
      'สาขา '+branches[active.branch].name,
      'คลาส '+classes[active.type].name,
      'วันที่ '+thaiDay.format(visit)+' เวลา '+active.time+' น.',
      'ผู้สอน '+coaches[active.coach].name,
      'จำนวน '+people.value+' คน',
      'รบกวนตรวจสอบรอบและแจ้งยืนยันด้วยค่ะ/ครับ',
    ];
    if (!oa) lines.unshift('[ข้อความทดลองจากเว็บตัวอย่าง]');
    message.value = lines.join('\n');
    const encoded = encodeURIComponent(message.value);
    lineLink.href = oa ? 'https://line.me/R/oaMessage/'+encodeURIComponent(oa)+'/?'+encoded : 'https://line.me/R/share?text='+encoded;
    status.textContent = '';
    draft.hidden = false;
    message.focus();
  });
  document.querySelector('#copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'คัดลอกข้อความแล้ว';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'เลือกข้อความแล้ว กดคัดลอกจากอุปกรณ์ของคุณได้เลย';
    }
  });
}
