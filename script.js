// DAWA lukker torsdag d. 1. oktober 2026 kl. 10:00 dansk tid.
// +02:00 er korrekt UTC-offset for Danmark på denne dato (sommertid, som først slutter d. 25. okt 2026).
const TARGET_DATE = new Date('2026-10-01T10:00:00+02:00');

const STATUS_CHECK_URL = 'https://api.dataforsyningen.dk/adresser?q=Bogfinkevej%204,2630';
const STATUS_CHECK_INTERVAL_MS = 30000;
const STATUS_CHECK_TIMEOUT_MS = 8000;

const el = {
  countdown: document.getElementById('countdown'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  finishedText: document.getElementById('finished-text'),
  statusText: document.getElementById('status-text'),
  lastChecked: document.getElementById('last-checked'),
  waveform: document.getElementById('waveform'),
};

let isTimeUp = false;

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const diffMs = TARGET_DATE.getTime() - Date.now();
  const finished = diffMs <= 0;
  isTimeUp = finished;

  el.countdown.classList.toggle('finished', finished);
  el.finishedText.hidden = !finished;

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  el.days.textContent = pad(days);
  el.hours.textContent = pad(hours);
  el.minutes.textContent = pad(minutes);
  el.seconds.textContent = pad(seconds);
}

function formatDanishTimestamp(date) {
  const formatted = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
  return `${formatted} (dansk tid)`;
}

async function checkDawaStatus() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STATUS_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(STATUS_CHECK_URL, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Sikrer at svaret rent faktisk kan parses som JSON, ikke bare at statuskoden er OK.
    await response.json();

    if (isTimeUp) {
      // Tiden er udløbet, men DAWA svarer stadig - kræver nok manuel nedlukning af servere.
      el.statusText.textContent = 'DAWA SVARER STADIG - TIDEN ER UDLØBET';
      el.statusText.className = 'status status-warning';
      document.body.classList.remove('state-down');
      document.body.classList.add('state-warning');
    } else {
      el.statusText.textContent = 'DAWA ER OPPE';
      el.statusText.className = 'status status-up';
      document.body.classList.remove('state-down', 'state-warning');
    }
  } catch (err) {
    el.statusText.textContent = 'DAWA ER LUKKET';
    el.statusText.className = 'status status-down';
    document.body.classList.remove('state-warning');
    document.body.classList.add('state-down');
  } finally {
    clearTimeout(timeoutId);
    el.lastChecked.textContent = `Sidst tjekket: ${formatDanishTimestamp(new Date())}`;
  }
}

function buildWaveform(barCount = 40) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
    bar.style.animationDuration = `${(0.6 + Math.random() * 0.8).toFixed(2)}s`;
    fragment.appendChild(bar);
  }
  el.waveform.appendChild(fragment);
}

buildWaveform();
updateCountdown();
setInterval(updateCountdown, 1000);

checkDawaStatus();
setInterval(checkDawaStatus, STATUS_CHECK_INTERVAL_MS);
