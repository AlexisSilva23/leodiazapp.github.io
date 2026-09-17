// ==========================================
// 📝 ELEMENTOS DEL DOM
// ==========================================
const screenAuth = document.getElementById('screen-auth');
const screenLocked = document.getElementById('screen-locked');
const screenContent = document.getElementById('screen-content');
const inputClave = document.getElementById('input-clave');
const btnUnlock = document.getElementById('btn-unlock');
const authError = document.getElementById('auth-error');
const attemptCounter = document.getElementById('attempt-counter');

// ==========================================
// 🛡️ PROTECCIÓN CONTRA FUERZA BRUTA
// ==========================================
let intentosFallidos = 0;
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO = 60000;
let bloqueado = false;

// ==========================================
// 🔓 EVENTO: DESBLOQUEAR (comentado en dev)
// ==========================================
btnUnlock.addEventListener('click', async () => {
    if (bloqueado) {
        mostrarError(`Espera un poco antes de intentar de nuevo.`);
        return;
    }

    const claveIngresada = inputClave.value.trim();
    if (!claveIngresada) {
        mostrarError("Por favor ingresa una clave.");
        return;
    }

    btnUnlock.disabled = true;
    btnUnlock.innerHTML = '<div class="spinner"></div> Verificando...';
    authError.style.display = 'none';

    try {
        const { data: esValida, error } = await supabaseClient
            .rpc('verificar_clave', { p_clave: claveIngresada });

        if (error) throw error;

        if (!esValida) {
            intentosFallidos++;

            if (intentosFallidos >= MAX_INTENTOS) {
                bloqueado = true;
                btnUnlock.disabled = true;
                btnUnlock.innerText = "Bloqueado";
                mostrarError(`Demasiados intentos. Por favor intenta en 1 minuto.`);
                setTimeout(() => {
                    bloqueado = false;
                    intentosFallidos = 0;
                    btnUnlock.disabled = false;
                    btnUnlock.innerText = "Desbloquear";
                    authError.style.display = 'none';
                    attemptCounter.innerText = "";
                }, TIEMPO_BLOQUEO);
            } else {
                const intentosRestantes = MAX_INTENTOS - intentosFallidos;
                mostrarError(`Clave inválida o ya utilizada.`);
                attemptCounter.innerHTML = `<strong>Intentos restantes: ${intentosRestantes}/${MAX_INTENTOS}</strong>`;
                btnUnlock.disabled = false;
                btnUnlock.innerText = "Desbloquear";
            }
            return;
        }

        // Clave válida → mostrar contenido
        mostrarContenido();

    } catch (error) {
        console.error("Error al verificar clave:", error);
        mostrarError("Error de conexión. Intenta de nuevo.");
        btnUnlock.disabled = false;
        btnUnlock.innerText = "Desbloquear";
    }
});

/*
// 🔧 DEV: entra directo al contenido
window.addEventListener('DOMContentLoaded', () => {
    mostrarContenido();
});
*/


// ==========================================
// 📺 FUNCIÓN: Mostrar contenido desbloqueado
// ==========================================
function mostrarContenido() {
    screenAuth.classList.remove('active');
    screenContent.classList.add('active');
    screenContent.innerHTML = '';

    // ── PASO 1: NOTA 1 ──
    const step1 = document.createElement('div');
    step1.className = 'note step';
    const nota1 = MENSAJE_CONFIG.notas[0];
    step1.innerHTML = `<h2>${nota1.titulo}</h2><p>${nota1.contenido}</p>`;

    const btn1 = document.createElement('button');
    btn1.textContent = 'Continuar';
    btn1.className = 'btn-continuar';
    step1.appendChild(btn1);
    screenContent.appendChild(step1);

    // ── PASO 2: NOTA 2 (audio) ──
    const step2 = document.createElement('div');
    step2.className = 'note step';
    step2.style.display = 'none';
    step2.innerHTML = `
    <h2>${MENSAJE_CONFIG.tituloAudio}</h2>
    <p style="color: var(--primary); font-weight: 600; margin-bottom: 15px;">
        ${MENSAJE_CONFIG.fraseAudio}
    </p>
    <p>${MENSAJE_CONFIG.textoAudio}</p>

    <label style="display:flex; align-items:center; gap:8px; margin:15px 0; cursor:pointer;">
        <input type="checkbox" id="check-auriculares" />
        Confirmo que tengo auriculares puestos
    </label>

    <audio id="player" controls preload="metadata" src="audio/Diamante de 1,60.mp3.mpeg" disabled></audio>
    <p id="audio-warning" style="color: var(--primary); font-size: 0.9rem; margin-top: 10px;">
        Marca la casilla para habilitar el audio.
    </p>
`;
    screenContent.appendChild(step2);

    // ── PASO 3: NOTA 3 (oculta hasta terminar audio) ──
    const step3 = document.createElement('div');
    step3.className = 'note step';
    step3.style.display = 'none';
    step3.innerHTML = `
        <h2>${MENSAJE_CONFIG.nota3.titulo}</h2>
        <p>${MENSAJE_CONFIG.nota3.contenido}</p>
    `;
    screenContent.appendChild(step3);

    // ── NAVEGACIÓN ──
    btn1.onclick = () => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── LÓGICA DE AUDIO ──
    const audioPlayer = document.getElementById('player');
    const audioWarning = document.getElementById('audio-warning');
    const checkAuriculares = document.getElementById('check-auriculares');

    checkAuriculares.addEventListener('change', () => {
        if (checkAuriculares.checked) {
            audioPlayer.disabled = false;
            audioWarning.textContent = '';
        } else {
            audioPlayer.pause();
            audioPlayer.disabled = true;
            audioWarning.textContent = 'Marca la casilla para habilitar el audio.';
        }
    });

    audioPlayer.addEventListener('ended', () => {
    step2.style.display = 'none';
    step3.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(bloquearPagina, 120000);   // respaldo: 2 minutos

    // Botón para cerrar manualmente
    const btnCerrar = document.createElement('button');
    btnCerrar.textContent = 'Cerrar mensaje';
    btnCerrar.className = 'btn-continuar';
    btnCerrar.onclick = bloquearPagina;
    step3.appendChild(btnCerrar);
}, { once: true });
}

// ==========================================
// 🔒 FUNCIÓN: Bloquear la página
// ==========================================
function bloquearPagina() {
    screenContent.classList.remove('active');
    screenLocked.classList.add('active');
}

// ==========================================
// ⚠️ FUNCIÓN: Mostrar error
// ==========================================
function mostrarError(mensaje) {
    authError.innerHTML = `<strong>⚠️ ${mensaje}</strong>`;
    authError.style.display = 'block';
}

// ==========================================
// ⌨️ EVENTO: Enter para desbloquear
// ==========================================
inputClave.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnUnlock.click();
    }
});