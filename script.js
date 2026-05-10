let total = 0;

const noteBtn = document.getElementById('noteBtn');
const counter = document.getElementById('counter');
const noteWrapper = noteBtn.closest('.note-wrapper');

noteBtn.addEventListener('click', (e) => {
  total += 1;
  updateCounter();
  spawnFloatLabel(e);
  triggerNotePress();
});

function updateCounter() {
  counter.textContent = '£' + total.toLocaleString('en-GB');
  counter.classList.remove('bump');
  void counter.offsetWidth;
  counter.classList.add('bump');
  counter.addEventListener('transitionend', () => {
    counter.classList.remove('bump');
  }, { once: true });
}

function spawnFloatLabel(e) {
  const label = document.createElement('span');
  label.className = 'float-label';
  label.textContent = '+£1';

  const wrapRect = noteWrapper.getBoundingClientRect();
  const x = e.clientX - wrapRect.left;
  const y = e.clientY - wrapRect.top;
  const jitter = (Math.random() - 0.5) * 30;

  label.style.left = (x + jitter - 16) + 'px';
  label.style.top  = (y - 10) + 'px';

  noteWrapper.appendChild(label);
  label.addEventListener('animationend', () => label.remove(), { once: true });
}

function triggerNotePress() {
  noteBtn.classList.add('pressing');
  setTimeout(() => noteBtn.classList.remove('pressing'), 80);
}
