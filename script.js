let total = 0;
let clickValue = 1;
let upgradeCount = 0;
let perSecond = 0;
let milestoneTriggered  = false;
let milestone2Triggered = false;

const noteBtn      = document.getElementById('noteBtn');
const perSecondEl  = document.getElementById('perSecond');
const counter      = document.getElementById('counter');
const noteWrapper  = noteBtn.closest('.note-wrapper');
const statMPC      = document.getElementById('statMPC');
const statMPS      = document.getElementById('statMPS');
const milestoneOverlay = document.getElementById('milestoneOverlay');
const msClose          = document.getElementById('msClose');
const progressFill     = document.getElementById('progressFill');
const progressLabel    = document.getElementById('progressLabel');
const upgradesL0   = document.getElementById('upgradesL0');
const upgradesL1   = document.getElementById('upgradesL1');

// Level 0 upgrade refs
const buyBtn  = document.getElementById('buyBtn');  const ownedCount  = document.getElementById('ownedCount');
const buyBtn2 = document.getElementById('buyBtn2'); const ownedCount2 = document.getElementById('ownedCount2'); let upgradeCount2 = 0;
const buyBtn3 = document.getElementById('buyBtn3'); const ownedCount3 = document.getElementById('ownedCount3'); let upgradeCount3 = 0;
const buyBtn4 = document.getElementById('buyBtn4'); const ownedCount4 = document.getElementById('ownedCount4'); let upgradeCount4 = 0;

// Level 1 upgrade refs
const buyBtn5 = document.getElementById('buyBtn5'); const ownedCount5 = document.getElementById('ownedCount5'); let upgradeCount5 = 0;
const buyBtn6 = document.getElementById('buyBtn6'); const ownedCount6 = document.getElementById('ownedCount6'); let upgradeCount6 = 0;
const buyBtn7 = document.getElementById('buyBtn7'); const ownedCount7 = document.getElementById('ownedCount7'); let upgradeCount7 = 0;
const buyBtn8 = document.getElementById('buyBtn8'); const ownedCount8 = document.getElementById('ownedCount8'); let upgradeCount8 = 0;

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

// Level 0 buy handlers
buyBtn.addEventListener('click', () => {
  if (total < 25) return;
  total -= 25; clickValue += 1; upgradeCount++;
  ownedCount.textContent = 'Owned: ' + upgradeCount;
  updateCounter(); updateShopStats(); updateBuyBtn();
});

buyBtn2.addEventListener('click', () => {
  if (total < 250) return;
  total -= 250; clickValue += 10; upgradeCount2++;
  ownedCount2.textContent = 'Owned: ' + upgradeCount2;
  updateCounter(); updateShopStats(); updateBuyBtn();
});

buyBtn3.addEventListener('click', () => {
  if (total < 5000) return;
  total -= 5000; clickValue += 50; upgradeCount3++;
  ownedCount3.textContent = 'Owned: ' + upgradeCount3;
  updateCounter(); updateShopStats(); updateBuyBtn();
});

buyBtn4.addEventListener('click', () => {
  if (total < 100) return;
  total -= 100; perSecond += 1; upgradeCount4++;
  ownedCount4.textContent = 'Owned: ' + upgradeCount4;
  updateCounter(); updatePerSecond(); updateBuyBtn();
});

// Level 1 buy handlers
buyBtn5.addEventListener('click', () => {
  if (total < 1500) return;
  total -= 1500; perSecond += 10; upgradeCount5++;
  ownedCount5.textContent = 'Owned: ' + upgradeCount5;
  updateCounter(); updatePerSecond(); updateBuyBtn();
});

buyBtn6.addEventListener('click', () => {
  if (total < 5000) return;
  total -= 5000; clickValue += 150; upgradeCount6++;
  ownedCount6.textContent = 'Owned: ' + upgradeCount6;
  updateCounter(); updateShopStats(); updateBuyBtn();
});

buyBtn7.addEventListener('click', () => {
  if (total < 20000) return;
  total -= 20000; perSecond += 75; upgradeCount7++;
  ownedCount7.textContent = 'Owned: ' + upgradeCount7;
  updateCounter(); updatePerSecond(); updateBuyBtn();
});

buyBtn8.addEventListener('click', () => {
  if (total < 100000) return;
  total -= 100000; clickValue += 1000; upgradeCount8++;
  ownedCount8.textContent = 'Owned: ' + upgradeCount8;
  updateCounter(); updateShopStats(); updateBuyBtn();
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
  updateProgress();
  if (!milestoneTriggered && total >= 10000) {
    milestoneTriggered = true;
    upgradesL0.hidden = true;
    upgradesL1.hidden = false;
    showMilestone('Level 1: Market Master', 'Well done, you have made it to<br>Level 1: Market Master!');
  }
  if (!milestone2Triggered && total >= 5000000) {
    milestone2Triggered = true;
    showMilestone('Level 2: Warehouse Wizard', 'Well done, you have made it to<br>Level 2: Warehouse Wizard!');
  }
}

function updateProgress() {
  let pct, label;
  if (total < 10000) {
    pct   = total / 10000;
    label = 'Level 1 — £' + Math.floor(total).toLocaleString('en-GB') + ' / £10,000';
  } else if (total < 5000000) {
    pct   = (total - 10000) / (5000000 - 10000);
    label = 'Level 2 — £' + Math.floor(total).toLocaleString('en-GB') + ' / £5,000,000';
  } else {
    pct   = 1;
    label = 'Level 2 complete!';
  }
  progressFill.style.width = Math.min(pct * 100, 100) + '%';
  const glow = 4 + pct * 12;
  progressFill.style.boxShadow = `0 0 ${glow}px rgba(152,251,152,${0.3 + pct * 0.5})`;
  progressLabel.textContent = label;
}

function showMilestone(title, msg) {
  document.querySelector('.ms-trophy-title').textContent = title;
  document.querySelector('.ms-trophy-msg').innerHTML = msg;
  ['.ms-star', '.ms-wizard', '.ms-trophy'].forEach(sel => {
    const el = document.querySelector(sel);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
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
  buyBtn5.disabled = total < 1500;
  buyBtn6.disabled = total < 5000;
  buyBtn7.disabled = total < 20000;
  buyBtn8.disabled = total < 100000;
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
