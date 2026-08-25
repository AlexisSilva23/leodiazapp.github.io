document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = 'mensaje_bloqueado_visto';
    const audio = document.getElementById('bg-music');

    const screenLocked = document.getElementById('screen-locked');
    const screenIntro = document.getElementById('screen-intro');
    const screenContent = document.getElementById('screen-content');

    const btnStart = document.getElementById('btn-start');
    const btnFinish = document.getElementById('btn-finish');
    const nextButtons = document.querySelectorAll('.btn-next');
    const noteCards = document.querySelectorAll('.note-card');
    const progressContainer = document.getElementById('progress-dots');
    // 1. Verificar si ya fue visto
    try {
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
            screenIntro.classList.remove('active');
            screenContent.classList.remove('active');
            screenLocked.classList.add('active');
        }
    } catch (e) {
        console.warn("Storage no disponible:", e);
    }

    // 2. Generar puntos indicadores
    if (progressContainer) {
        progressContainer.innerHTML = '';
        noteCards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            progressContainer.appendChild(dot);
        });
    }

    // 3. Abrir mensaje
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            if (audio) {
                audio.play().catch(() => console.log("Audio en espera de archivo"));
            }

            // Guardar marca de visto
            try {
                localStorage.setItem(STORAGE_KEY, 'true');
            } catch (e) { }

            // Mostrar contenido de notas
            screenIntro.classList.remove('active');
            screenContent.classList.add('active');
        });
    }

    // 4. Botones Siguiente
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

    // 5. Cerrar mensaje final
    if (btnFinish) {
        btnFinish.addEventListener('click', () => {
            if (audio) audio.pause();
            screenContent.classList.remove('active');
            screenLocked.classList.add('active');
        });
    }
});
  </script >
</body >
</html >