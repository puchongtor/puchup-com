for (const [group, selector, key, status] of [
  ['[data-review-filters]','[data-review]','review','[data-review-status]'],
  ['[data-gallery-filters]','[data-photo-category]','photoCategory',null],
]) {
  const filter = document.querySelector(group);
  if (!filter) continue;
  const buttons = [...filter.querySelectorAll('button')];
  const items = [...document.querySelectorAll(selector)];
  const output = status ? document.querySelector(status) : null;
  filter.addEventListener('click', event => {
    const chosen = event.target.closest('button[data-value]');
    if (!chosen) return;
    for (const button of buttons) button.setAttribute('aria-pressed',String(button===chosen));
    let visible = 0;
    for (const item of items) {
      item.hidden = chosen.dataset.value!=='all'&&item.dataset[key]!==chosen.dataset.value;
      if (!item.hidden) visible++;
    }
    if (output) output.textContent = 'แสดง '+visible+' รีวิว';
  });
}

const photos = [...document.querySelectorAll('[data-photo]')];
if (photos.length && typeof HTMLDialogElement !== 'undefined') {
  const viewer = document.createElement('dialog');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-label','ภาพจากศูนย์บริการ');
  viewer.innerHTML = '<form method="dialog"><button type="submit" aria-label="ปิดภาพ">×</button></form><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.append(viewer);
  for (const link of photos) link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const image = viewer.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    viewer.querySelector('figcaption').textContent = image.alt;
    viewer.showModal();
    viewer.addEventListener('close', () => link.focus(), {once:true});
  });
}
