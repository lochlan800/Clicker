let total = 0;
let clickValue = 1;
let upgradeCount = 0;
let perSecond = 0;
let milestoneTriggered = false;

const noteBtn      = document.getElementById('noteBtn');
const perSecondEl  = document.getElementById('perSecond');
const counter      = document.getElementById('counter');
const noteWrapper  = noteBtn.closest('.note-wrapper');
const buyBtn       = document.getElementById('buyBtn');
const ownedCount   = document.getElementById('ownedCount');
const buyBtn2      = document.getElementById('buyBtn2');
const ownedCount2  = document.getElementById('ownedCount2');
let upgradeCount2  = 0;
const buyBtn3      = document.getElementById('buyBtn3');
const ownedCount3  = document.getElementById('ownedCount3');
let upgradeCount3  = 0;
const buyBtn4      = document.getElementById('buyBtn4');
const ownedCount4  = document.getElementById('ownedCount4');
let upgradeCount4  = 0;
const statMPC          = document.getElementById('statMPC');
const statMPS          = document.getElementById('statMPS');
const milestoneOverlay = document.getElementById('milestoneOverlay');
const msClose          = document.getElementById('msClose');

msClose.addEventListener('click', () => { milestoneOverlay.hidden = true; });

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.panel).classList.remove('hidden');
  });
});

noteBtn.addEventListener('click', (e) => {
  total += clickValue;
  updateCounter();
  spawnFloatLabel(e);
  triggerNotePress();
  updateBuyBtn();
});

buyBtn4.addEventListener('click', () => {
  if (total < 100) return;
  total -= 100;
  perSecond += 1;
  upgradeCount4 += 1;
  ownedCount4.textContent = 'Owned: ' + upgradeCount4;
  updateCounter();
  updatePerSecond();
  updateBuyBtn();
});

buyBtn.addEventListener('click', () => {
  if (total < 25) return;
  total -= 25;
  clickValue += 1;
  upgradeCount += 1;
  ownedCount.textContent = 'Owned: ' + upgradeCount;
  updateCounter();
  updateShopStats();
  updateBuyBtn();
});

buyBtn2.addEventListener('click', () => {
  if (total < 250) return;
  total -= 250;
  clickValue += 10;
  upgradeCount2 += 1;
  ownedCount2.textContent = 'Owned: ' + upgradeCount2;
  updateCounter();
  updateShopStats();
  updateBuyBtn();
});

buyBtn3.addEventListener('click', () => {
  if (total < 5000) return;
  total -= 5000;
  clickValue += 50;
  upgradeCount3 += 1;
  ownedCount3.textContent = 'Owned: ' + upgradeCount3;
  updateCounter();
  updateShopStats();
  updateBuyBtn();
});

setInterval(() => {
  if (perSecond === 0) return;
  total += perSecond;
  updateCounter();
  updateBuyBtn();
}, 1000);

function updateCounter() {
  counter.textContent = '£' + total.toLocaleString('en-GB');
  counter.classList.remove('bump');
  void counter.offsetWidth;
  counter.classList.add('bump');
  counter.addEventListener('transitionend', () => {
    counter.classList.remove('bump');
  }, { once: true });
  if (!milestoneTriggered && total >= 10000) {
    milestoneTriggered = true;
    triggerMilestone();
  }
}

function triggerMilestone() {
  milestoneOverlay.hidden = false;
}

function updatePerSecond() {
  perSecondEl.textContent = '£' + perSecond.toLocaleString('en-GB') + ' / sec';
  statMPS.textContent = '£' + perSecond.toLocaleString('en-GB');
}

function updateShopStats() {
  statMPC.textContent = '£' + clickValue.toLocaleString('en-GB');
}

function updateBuyBtn() {
  buyBtn.disabled  = total < 25;
  buyBtn2.disabled = total < 250;
  buyBtn3.disabled = total < 5000;
  buyBtn4.disabled = total < 100;
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
