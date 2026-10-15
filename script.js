const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const segmentMap = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'g', 'c', 'd'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'g', 'e', 'c', 'd'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

document.querySelectorAll('.seg-display').forEach((display) => {
  const value = display.dataset.value || display.textContent.trim();
  const minimumDigits = Number(display.dataset.digits || 0);
  const digitCount = [...value].filter((character) => /\d/.test(character)).length;
  const paddedValue = `${' '.repeat(Math.max(0, minimumDigits - digitCount))}${value}`;
  display.setAttribute('aria-label', value);
  display.textContent = '';

  [...paddedValue].forEach((character) => {
    if (character === '.') {
      const dot = document.createElement('span');
      dot.className = 'seven-dot';
      display.append(dot);
      return;
    }

    const digit = document.createElement('span');
    digit.className = 'seven-digit';
    digit.setAttribute('aria-hidden', 'true');
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((name) => {
      const segment = document.createElement('i');
      segment.className = `seven-seg ${name}${segmentMap[character]?.includes(name) ? ' is-on' : ''}`;
      digit.append(segment);
    });
    display.append(digit);
  });

  requestAnimationFrame(() => setTimeout(() => display.classList.add('is-live'), 180));
});

const form = document.querySelector('#service-form');
const message = document.querySelector('#form-message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  message.className = 'form-message';

  const fields = [...form.querySelectorAll('input[required], select[required], textarea[required]')];
  fields.forEach((field) => field.removeAttribute('aria-invalid'));
  const invalid = fields.find((field) => !field.checkValidity());

  if (invalid) {
    invalid.setAttribute('aria-invalid', 'true');
    invalid.focus();
    message.classList.add('error');
    message.textContent = 'Popunite označeno polje i pokušajte ponovo.';
    return;
  }

  const data = new FormData(form);
  const subject = `Zahtev za servis — ${data.get('marka')} ${data.get('model')}`;
  const body = [
    `Marka: ${data.get('marka')}`,
    `Model: ${data.get('model')}`,
    `Godište: ${data.get('godiste')}`,
    `Usluga: ${data.get('usluga')}`,
    '',
    'Opis simptoma:',
    data.get('simptom'),
  ].join('\n');

  message.classList.add('success');
  message.textContent = 'Otvaramo poruku sa popunjenim podacima. Pošaljite je da biste poslali zahtev servisu.';
  window.location.href = `mailto:servis@autoservisatlas.rs?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
