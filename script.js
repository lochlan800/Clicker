let total = 0;
let clickValue = 1;
let upgradeCount = 0;

const noteBtn    = document.getElementById('noteBtn');
const counter    = document.getElementById('counter');
const noteWrapper = noteBtn.closest('.note-wrapper');
const buyBtn      = document.getElementById('buyBtn');
const ownedCount  = document.getElementById('ownedCount');
const buyBtn2     = document.getElementById('buyBtn2');
const ownedCount2 = document.getElementById('ownedCount2');
let upgradeCount2 = 0;
const shopToggle = document.getElementById('shopToggle');
const shopDrawer = document.getElementById('shopDrawer');

shopToggle.addEventListener('click', () => shopDrawer.classList.toggle('open'));

noteBtn.addEventListener('click', (e) => {
  total += clickValue;
  updateCounter();
  spawnFloatLabel(e);
  triggerNotePress();
  updateBuyBtn();
});

buyBtn.addEventListener('click', () => {
  if (total < 25) return;
  total -= 25;
  clickValue += 1;
  upgradeCount += 1;
  ownedCount.textContent = 'Owned: ' + upgradeCount;
  updateCounter();
  updateBuyBtn();
});

buyBtn2.addEventListener('click', () => {
  if (total < 150) return;
  total -= 150;
  clickValue += 10;
  upgradeCount2 += 1;
  ownedCount2.textContent = 'Owned: ' + upgradeCount2;
  updateCounter();
  updateBuyBtn();
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

function updateBuyBtn() {
  buyBtn.disabled  = total < 25;
  buyBtn2.disabled = total < 150;
}

function spawnFloatLabel(e) {
  const label = document.createElement('span');
  label.className = 'float-label';
  label.textContent = '+£' + clickValue;

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
