const STORAGE_KEY = 'carta_amor_vista';
const audio = document.getElementById('bg-music');

const screenLocked = document.getElementById('screen-locked');
const screenIntro = document.getElementById('screen-intro');
const screenContent = document.getElementById('screen-content');

const btnStart = document.getElementById('btn-start');
const btnFinish = document.getElementById('btn-finish');
const nextButtons = document.querySelectorAll('.btn-next');
const noteCards = document.querySelectorAll('.note-card');
const progressContainer = document.getElementById('progress-dots');

let currentCardIndex = 0;

// Verificación inicial
if (localStorage.getItem(STORAGE_KEY) === 'true') {
  screenLocked.classList.add('active');
} else {
  screenIntro.classList.add('active');
}

// Generar indicadores de progreso
noteCards.forEach((_, idx) => {
  const dot = document.createElement('div');
  dot.className = `dot ${idx === 0 ? 'active' : ''}`;
  progressContainer.appendChild(dot);
});

// Iniciar experiencia y reproducir música
btnStart.addEventListener('click', () => {
  audio.play().catch((e) => console.log("Reproducción automática bloqueada:", e));
  localStorage.setItem(STORAGE_KEY, 'true');
  screenIntro.classList.remove('active');
  screenContent.classList.add('active');
});

// Avanzar entre notas
nextButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    noteCards[currentCardIndex].classList.remove('active');
    currentCardIndex++;
    if (currentCardIndex < noteCards.length) {
      noteCards[currentCardIndex].classList.add('active');
      updateDots();
    }
  });
});

function updateDots() {
  const dots = progressContainer.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentCardIndex);
  });
}

// Finalizar y bloquear
btnFinish.addEventListener('click', () => {
  audio.pause();
  screenContent.classList.remove('active');
  screenLocked.classList.add('active');
});