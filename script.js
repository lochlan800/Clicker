let total = 0;
let clickValue = 1;
let upgradeCount = 0;
let perSecond = 0;
let milestoneTriggered  = false;
let milestone2Triggered = false;
let level1Target = 10000;
let level2Target = 5000000;
let spinCost = 5000;
let isSpinning = false;

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
const spinBtn      = document.getElementById('spinBtn');
const wheelOverlay = document.getElementById('wheelOverlay');
const wheelCanvas  = document.getElementById('wheelCanvas');
const wheelResult  = document.getElementById('wheelResult');
const wheelResultText = document.getElementById('wheelResultText');
const wheelClose   = document.getElementById('wheelClose');
const ctx          = wheelCanvas.getContext('2d');

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

// Wheel effect helpers — guarantee percentage outcomes always change the value
function applyBoost(value, multiplier) {
  if (value <= 0) return value;
  const next = Math.floor(value * multiplier);
  return next > value ? next : value + 1;
}
function applyCut(value, multiplier) {
  if (value <= 0) return 0;
  const next = Math.floor(value * multiplier);
  return next < value ? Math.max(0, next) : Math.max(0, value - 1);
}

// Wheel segments
const SEGMENTS = [
  { label: '+5% All',        desc: '+5% to total money, per/sec & per/click',    color: '#2a7a45', effect() { total = applyBoost(total, 1.05); perSecond = applyBoost(perSecond, 1.05); clickValue = Math.max(1, applyBoost(clickValue, 1.05)); } },
  { label: '+8% All',        desc: '+8% to total money, per/sec & per/click',    color: '#359955', effect() { total = applyBoost(total, 1.08); perSecond = applyBoost(perSecond, 1.08); clickValue = Math.max(1, applyBoost(clickValue, 1.08)); } },
  { label: '+10% All',       desc: '+10% to total money, per/sec & per/click',   color: '#40b865', effect() { total = applyBoost(total, 1.10); perSecond = applyBoost(perSecond, 1.10); clickValue = Math.max(1, applyBoost(clickValue, 1.10)); } },
  { label: 'L1 Target ↓', desc: 'Level 1 target reduced by 20%',           color: '#4ed475', effect() { level1Target = Math.floor(level1Target * 0.8); } },
  { label: 'All Targets ↓', desc: 'All level targets reduced by 20%',      color: '#5ee882', effect() { level1Target = Math.floor(level1Target * 0.8); level2Target = Math.floor(level2Target * 0.8); } },
  { label: '+£100',     desc: '£100 added to your total',              color: '#72f094', effect() { total += 100; } },
  { label: '+£1,000',   desc: '£1,000 added to your total',            color: '#88f4a6', effect() { total += 1000; } },
  { label: '+£10,000',  desc: '£10,000 added to your total',           color: '#a0f8bb', effect() { total += 10000; } },
  { label: '-5% All',        desc: '-5% to total money, per/sec & per/click',    color: '#8b2020', effect() { total = applyCut(total, 0.95); perSecond = applyCut(perSecond, 0.95); clickValue = Math.max(1, applyCut(clickValue, 0.95)); } },
  { label: '-8% All',        desc: '-8% to total money, per/sec & per/click',    color: '#a82828', effect() { total = applyCut(total, 0.92); perSecond = applyCut(perSecond, 0.92); clickValue = Math.max(1, applyCut(clickValue, 0.92)); } },
  { label: '-10% All',       desc: '-10% to total money, per/sec & per/click',   color: '#c43030', effect() { total = applyCut(total, 0.90); perSecond = applyCut(perSecond, 0.90); clickValue = Math.max(1, applyCut(clickValue, 0.90)); } },
  { label: '-£100',     desc: '£100 deducted from your total',         color: '#e03838', effect() { total = Math.max(0, total - 100); } },
  { label: '-£1,000',   desc: '£1,000 deducted from your total',       color: '#f44040', effect() { total = Math.max(0, total - 1000); } },
];
const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = (2 * Math.PI) / SEG_COUNT;

// Draw the wheel at a given rotation angle
function drawWheel(rotation) {
  const cx = wheelCanvas.width / 2;
  const cy = wheelCanvas.height / 2;
  const r  = cx - 4;
  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  SEGMENTS.forEach((seg, i) => {
    const start = rotation + i * SEG_ANGLE - Math.PI / 2;
    const end   = start + SEG_ANGLE;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + SEG_ANGLE / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillText(seg.label, r - 10, 4);
    ctx.restore();
  });
  // Centre circle
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = '#0d1f12';
  ctx.fill();
  ctx.strokeStyle = '#98fb98';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Spin the wheel
function spinWheel() {
  if (isSpinning || total < spinCost) return;
  total -= spinCost;
  updateCounter();
  updateBuyBtn();
  isSpinning = true;
  wheelResult.hidden = true;
  wheelOverlay.hidden = false;

  const segIndex     = Math.floor(Math.random() * SEG_COUNT);
  const fullSpins    = Math.floor(6 + Math.random() * 4); // integer full rotations
  const finalRotation = 2 * Math.PI * fullSpins - (segIndex * SEG_ANGLE + SEG_ANGLE / 2);
  const duration     = 4500;
  const startTime    = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    drawWheel(finalRotation * eased);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      drawWheel(finalRotation);
      isSpinning = false;
      SEGMENTS[segIndex].effect();
      updateCounter();
      updatePerSecond();
      updateShopStats();
      updateBuyBtn();
      wheelResultText.textContent = SEGMENTS[segIndex].desc;
      wheelResult.hidden = false;
    }
  }
  requestAnimationFrame(frame);
}

// Draw the wheel in its initial static state
drawWheel(0);

// Event listeners
msClose.addEventListener('click', () => { milestoneOverlay.hidden = true; });
spinBtn.addEventListener('click', spinWheel);
wheelClose.addEventListener('click', () => { wheelOverlay.hidden = true; });

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
  if (!milestoneTriggered && total >= level1Target) {
    milestoneTriggered = true;
    upgradesL0.hidden = true;
    upgradesL1.hidden = false;
    spinCost = 50000;
    spinBtn.textContent = '£50,000';
    showMilestone('Level 1: Market Master', 'Well done, you have made it to<br>Level 1: Market Master!');
  }
  if (!milestone2Triggered && total >= level2Target) {
    milestone2Triggered = true;
    showMilestone('Level 2: Warehouse Wizard', 'Well done, you have made it to<br>Level 2: Warehouse Wizard!');
  }
}

function updateProgress() {
  let pct, label;
  if (!milestoneTriggered) {
    pct   = Math.min(total / level1Target, 1);
    label = 'Level 1 — £' + Math.floor(total).toLocaleString('en-GB') + ' / £' + level1Target.toLocaleString('en-GB');
  } else if (!milestone2Triggered) {
    pct   = Math.min((total - level1Target) / (level2Target - level1Target), 1);
    label = 'Level 2 — £' + Math.floor(total).toLocaleString('en-GB') + ' / £' + level2Target.toLocaleString('en-GB');
  } else {
    pct   = 1;
    label = 'Level 2 complete!';
  }
  progressFill.style.width = (pct * 100) + '%';
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
  spinBtn.disabled = total < spinCost || isSpinning;
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
