const form = document.querySelector('#request-form');

if (form) {
  const fields = form.elements;
  const dateRow = document.querySelector('#request-date');
  const periodRow = document.querySelector('#request-period');
  const result = document.querySelector('#message-result');
  const message = document.querySelector('#request-message');
  const line = document.querySelector('#open-line');
  const status = document.querySelector('#copy-status');
  const error = document.querySelector('#reply-error');
  const params = new URLSearchParams(location.search);
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Bangkok' }).format(new Date());
  fields.date.min = today;

  function preselect(field, param) {
    const value = params.get(param);
    if (Array.from(field.options).some(option => option.value === value)) field.value = value;
  }

  function sync() {
    const booking = fields.mode.value === 'booking';
    dateRow.hidden = !booking;
    periodRow.hidden = !booking;
    fields.date.disabled = !booking;
    fields.period.disabled = !booking;
    fields.date.required = booking;
    fields.symptoms.required = !booking;
    result.hidden = true;
    status.textContent = '';
    error.textContent = '';
    line.removeAttribute('href');
  }

  fields.mode.value = params.get('mode') === 'estimate' ? 'estimate' : 'booking';
  preselect(fields.branch, 'branch');
  preselect(fields.service, 'service');
  sync();
  form.inert = false;
  form.addEventListener('input', sync);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const booking = fields.mode.value === 'booking';
    const model = fields.model.value.trim();
    const details = fields.details.value.trim();
    const symptoms = fields.symptoms.value.trim();
    if (!model || (!booking && !symptoms)) {
      error.textContent = !model ? 'กรุณาระบุยี่ห้อและรุ่นรถ' : 'กรุณาเล่าอาการหรือรายการที่ต้องการให้ประเมิน';
      (model ? fields.symptoms : fields.model).focus();
      return;
    }
    const selectedBranch = fields.branch.selectedOptions[0];
    const branch = selectedBranch.textContent;
    const service = fields.service.selectedOptions[0].textContent;
    const lines = [
      booking ? 'ขอนัดจองคิว Axle Bay' : 'ขอประเมินค่าซ่อม Axle Bay',
      branch,
      'บริการ: ' + service,
      'รถ: ' + model + (details ? ' · ' + details : ''),
    ];
    if (booking) {
      const utcDate = new Date(fields.date.value + 'T12:00:00Z');
      if (utcDate.getUTCDay()===Number(selectedBranch.dataset.closed)) {
        error.textContent = branch + ' เปิด ' + selectedBranch.dataset.hours + ' กรุณาเลือกวันที่เปิดทำการ';
        fields.date.focus();
        return;
      }
      const date = new Intl.DateTimeFormat('th-TH', { dateStyle: 'long', timeZone: 'Asia/Bangkok' })
        .format(utcDate);
      lines.push('วันที่สะดวก: ' + date + (fields.period.value ? ' · ' + fields.period.value : ''));
    }
    if (symptoms) lines.push('รายละเอียด: ' + symptoms);
    const account = form.dataset.lineOa;
    if (!account) lines.unshift('[ข้อความทดลองจากเว็บไซต์ตัวอย่าง]');
    message.value = lines.join('\n');
    const text = encodeURIComponent(message.value);
    line.href = account ? 'https://line.me/R/oaMessage/' + encodeURIComponent(account) + '/?' + text : 'https://line.me/R/share?text=' + text;
    result.hidden = false;
    status.textContent = '';
    document.querySelector('#message-heading').focus();
  });

  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'คัดลอกข้อความแล้ว';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'เลือกข้อความแล้ว กดคัดลอกจากอุปกรณ์ของคุณ';
    }
  });
}
