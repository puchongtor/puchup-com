const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!isOpen));
  document.getElementById('main-menu').classList.toggle('open', !isOpen);
});

const branchDialog = document.getElementById('branch-dialog');
if (branchDialog && typeof branchDialog.showModal === 'function') {
  const branchLinks = [...branchDialog.querySelectorAll('[data-branch]')];
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-choose-branch]');
    if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = new URL(link.href);
    for (const branchLink of branchLinks) {
      const branchUrl = new URL(destination);
      branchUrl.searchParams.set('branch', branchLink.dataset.branch);
      branchLink.href = branchUrl.href;
    }
    if (!branchDialog.open) branchDialog.showModal();
  });
  branchDialog.addEventListener('click', event => {
    if (event.target === branchDialog) branchDialog.close();
  });
}

for (const list of document.querySelectorAll('[data-filter-list]')) {
  const filters = [...list.querySelectorAll('[data-filter]')];
  const search = list.querySelector('[data-search]');
  const items = list.querySelectorAll('[data-item]');
  const update = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase('th');
    let showing = 0;
    for (const item of items) {
      const matchesFilter = filters.every(filter => !filter.value || filter.value === item.dataset[filter.dataset.filter]);
      const matchesSearch = item.textContent.toLocaleLowerCase('th').includes(query);
      item.hidden = !matchesFilter || !matchesSearch;
      if (!item.hidden) showing++;
    }
    list.querySelector('[data-empty]').hidden = showing > 0;
  };
  filters.forEach(filter => filter.addEventListener('change', update));
  search?.addEventListener('input', update);
}

const form = document.querySelector('[data-booking]');
if (form) {
  const params = new URLSearchParams(location.search);
  const result = document.querySelector('[data-result]');
  const doctor = form.querySelector('[data-doctor]');
  const doctorOptions = [...form.elements.namedItem('doctorIndex').options];
  let selectedDoctor = doctorOptions.find(option => option.value === params.get('doctor'))?.textContent || '';
  const preselect = name => {
    const field = form.elements.namedItem(name);
    const value = params.get(name);
    if ([...field.options].some(option => option.value === value)) field.value = value;
  };
  preselect('branch');
  preselect('service');
  const chatBranch = document.querySelector('[data-chat-branch]');
  const updateChatBranch = () => {
    const selected = form.elements.branch.selectedOptions[0];
    chatBranch.textContent = selected.value ? `ไลเนรา เดนทัล · ${selected.textContent}` : 'ไลเนรา เดนทัล';
  };
  updateChatBranch();
  if (selectedDoctor) {
    doctor.hidden = false;
    doctor.textContent = `คุณหมอตัวอย่าง · ${selectedDoctor}`;
  }
  form.elements.branch.addEventListener('change', () => {
    updateChatBranch();
    selectedDoctor = '';
    doctor.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const summary = ['branch', 'service', 'slot'].map(name => form.elements.namedItem(name).selectedOptions[0].textContent);
    if (selectedDoctor) summary.push(selectedDoctor);
    result.querySelector('[data-summary]').textContent = summary.join(' · ');
    form.hidden = true;
    result.hidden = false;
    result.querySelector('button').focus();
  });
  result.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    updateChatBranch();
    selectedDoctor = '';
    doctor.hidden = true;
    result.hidden = true;
    form.hidden = false;
    form.elements.branch.focus();
  });
}
