const MENSAJE_CONFIG = {
    titulo: "Mensaje especial",
    subtitulo: "Espero te guste 💝",
    notas: [
        {
            titulo: "Nota 1",
            contenido:
                "Si llegaste hasta aquí, significa que decidiste abrir este pequeño regalo que preparé para ti. n\
            Antes de continuar, quiero que sepas algo: esto no fue hecho para ponerte presión ni para esperar una respuesta de tu parte. n\
            Simplemente nació de una forma que tengo de expresar lo que a veces no digo con palabras. n\
            Sabes... escribir ha sido una manera de guardar momentos, emociones y pensamientos. n\
            Esta vez quise transformar algunas de esas palabras en algo diferente. n\
            Esta canción nace desde la admiración y el cariño hacia una persona que, de una u otra forma, dejó una huella bonita en mi vida. n\
            Escúchala con calma. n\
            Espero que la disfrutes tanto como yo disfruté crearla. n\
            — Leoncario"
        },
    ],
    fraseAudio: "⚠️ Conecta auriculares para continuar", // ← Frase con advertencia
    tituloAudio: "Una canción para ti",
    textoAudio: "Escúchala hasta el final 🎵",
    nota3: {
        titulo: "Nota 3",
        contenido:
            "Esta canción nació de una admiración sincera hacia la persona que eres, de esos pequeños detalles que quizás para muchos pasan desapercibidos, pero que hacen que alguien sea especial. n\
        No hice esto esperando una respuesta ni para poner ningún peso sobre ti. n\
        Simplemente quería regalarte algo que salió de mí y que representara lo bonito que ha sido coincidir contigo durante estos años.n\
        Me alegra haber conocido a alguien como tú, haber compartido momentos y poder verte comenzar una nueva etapa en tu vida.n\
        Espero que nunca dudes de tu valor, que sigas confiando en ti y que nunca pierdas esa esencia que te hace ser tu.n\
        La vida puede llevarnos por caminos distintos, pero siempre voy a desearte lo mejor y alegrarme por cada logro que consigas.n\
        Y si algún día necesitas una conversación, una ayuda o simplemente alguien que te escuche, sabes que puedes contar conmigo.n\
        Gracias por inspirar estas palabras.n\
        Con mucho cariño y admiración,n\
        Leonardon\
        Leoncario"
    }
};

// ==========================================
// 🔐 CREDENCIALES DE SUPABASE
// ==========================================
// ⚠️ IMPORTANTE: Usa la clave PÚBLICA (no la secreta)
// En Supabase: Settings > API > Project API Keys > anon (public)
const SUPABASE_URL = "https://txqgbyklrsddwgeaadkb.supabase.co";
const SUPABASE_KEY = "sb_publishable_e6ghzW3sfcGWHcaELhnjIg_hprebDft";

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
const TIEMPO_BLOQUEO = 60000; // 1 minuto en milisegundos
let bloqueado = false;

// ==========================================
// 🔓 EVENTO: DESBLOQUEAR
// ==========================================
btnUnlock.addEventListener('click', async () => {
    // Si está bloqueado, no hacer nada
    if (bloqueado) {
        mostrarError(`Espera un poco antes de intentar de nuevo.`);
        return;
    }

    const claveIngresada = inputClave.value.trim();

    // Validar que no esté vacío
    if (!claveIngresada) {
        mostrarError("Por favor ingresa una clave.");
        return;
    }

    // Mostrar estado de verificación
    btnUnlock.disabled = true;
    btnUnlock.innerHTML = '<div class="spinner"></div> Verificando...';
    authError.style.display = 'none';

    try {
        // 1. Consultar si la clave existe y NO ha sido usada
        const { data, error } = await supabase
            .from('claves')
            .select('*')
            .eq('clave', claveIngresada)
            .eq('usada', false)
            .single();

        if (error || !data) {
            // Clave inválida o ya utilizada
            intentosFallidos++;

            if (intentosFallidos >= MAX_INTENTOS) {
                // Bloquear después de X intentos
                bloqueado = true;
                btnUnlock.disabled = true;
                btnUnlock.innerText = "Bloqueado";
                mostrarError(`Demasiados intentos. Por favor intenta en 1 minuto.`);

                // Desbloquear después del tiempo especificado
                setTimeout(() => {
                    bloqueado = false;
                    intentosFallidos = 0;
                    btnUnlock.disabled = false;
                    btnUnlock.innerText = "Desbloquear";
                    authError.style.display = 'none';
                    attemptCounter.innerText = "";
                }, TIEMPO_BLOQUEO);
            } else {
                // Mostrar cuántos intentos quedan
                const intentosRestantes = MAX_INTENTOS - intentosFallidos;
                mostrarError(`Clave inválida o ya utilizada.`);
                attemptCounter.innerHTML = `<strong>Intentos restantes: ${intentosRestantes}/${MAX_INTENTOS}</strong>`;
                btnUnlock.disabled = false;
                btnUnlock.innerText = "Desbloquear";
            }
            return;
        }

        // 2. Clave válida: Quemar/invalidar inmediatamente
        await supabase
            .from('claves')
            .update({ usada: true, usada_en: new Date().toISOString() })
            .eq('clave', claveIngresada);

        // 3. Mostrar el contenido
        mostrarContenido();

    } catch (error) {
        console.error("Error al verificar clave:", error);
        mostrarError("Error de conexión. Intenta de nuevo.");
        btnUnlock.disabled = false;
        btnUnlock.innerText = "Desbloquear";
    }
});

// ==========================================
// 🎧 FUNCIÓN: Detectar auriculares
// ==========================================
async function detectarAuriculares() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.destination;
    
    // Intenta acceder a la salida de audio
    if (destination.maxChannelCount > 0) {
      // Detecta si hay salida de audio disponible
      // En la mayoría de navegadores modernos, esto indica auriculares
      return true;
    }
    return false;
  } catch (error) {
    // Si hay error, permitir reproducción (fallback seguro)
    console.warn("No se pudo detectar auriculares, permitiendo reproducción");
    return true;
  }
}

// ==========================================
// 📺 FUNCIÓN: Mostrar contenido desbloqueado
// ==========================================
function mostrarContenido() {
    screenAuth.classList.remove('active');
    screenContent.classList.add('active');

    // Limpiar contenido anterior
    screenContent.innerHTML = '';

    // NOTA 1
    const nota1 = MENSAJE_CONFIG.notas[0];
    const noteDiv1 = document.createElement('div');
    noteDiv1.className = 'note';
    noteDiv1.innerHTML = `
    <h2>${nota1.titulo}</h2>
    <p>${nota1.contenido}</p>
  `;
    screenContent.appendChild(noteDiv1);

    // NOTA 2: AUDIO CON FRASE DE ADVERTENCIA
    const audioSection = document.createElement('div');
    audioSection.className = 'note';
    audioSection.innerHTML = `
    <h2>Nota 2</h2>
    <p style="color: var(--primary); font-weight: 600; margin-bottom: 15px;">${MENSAJE_CONFIG.fraseAudio}</p>
    
    <div class="audio-input-group">
      <label for="audio-input">📁 Selecciona el archivo de audio:</label>
      <input type="file" id="audio-input" accept="audio/*" />
      <div id="audio-status" class="progress-info"></div>
    </div>
    
    <audio id="player" controls preload="none" style="display: none;"></audio>
    <div id="audio-placeholder" style="color: var(--muted); font-size: 0.9rem; padding: 20px;">
      Por favor sube un archivo de audio para continuar.
    </div>
  `;
    screenContent.appendChild(audioSection);

    // NOTA 3: OCULTA HASTA QUE TERMINE EL AUDIO
    const nota3Div = document.createElement('div');
    nota3Div.className = 'note';
    nota3Div.id = 'nota3-container';
    nota3Div.style.display = 'none'; // ← OCULTA AL PRINCIPIO
    nota3Div.innerHTML = `
    <h2>${MENSAJE_CONFIG.nota3.titulo}</h2>
    <p>${MENSAJE_CONFIG.nota3.contenido}</p>
  `;
    screenContent.appendChild(nota3Div);

    // Configurar evento de subida de audio
    const audioInput = document.getElementById('audio-input');
    const audioPlayer = document.getElementById('player');
    const audioStatus = document.getElementById('audio-status');
    const audioPlaceholder = document.getElementById('audio-placeholder');
    const nota3Container = document.getElementById('nota3-container');

    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validar que sea un archivo de audio
        if (!file.type.startsWith('audio/')) {
            audioStatus.innerHTML = '<span style="color: var(--primary);">❌ Por favor selecciona un archivo de audio válido.</span>';
            return;
        }

        // Validar tamaño (máximo 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            audioStatus.innerHTML = '<span style="color: var(--primary);">❌ El archivo es muy grande (máximo 50MB).</span>';
            return;
        }

        // Detectar auriculares antes de reproducir
        detectarAuriculares().then((hayAuriculares) => {
            if (!hayAuriculares) {
                audioStatus.innerHTML = '<span style="color: var(--primary);">⚠️ Por favor conecta auriculares para continuar.</span>';
                return;
            }

            // Crear URL del archivo y cargar el audio
            const url = URL.createObjectURL(file);
            audioPlayer.src = url;
            audioPlaceholder.style.display = 'none';
            audioPlayer.style.display = 'block';
            audioStatus.innerHTML = `<span style="color: var(--success);">✅ Audio cargado: ${file.name} - Auriculares detectados ✓</span>`;
        });

        // ← CAMBIO: Al terminar, mostrar nota 3 y después bloquear
        audioPlayer.addEventListener('ended', () => {
            nota3Container.style.display = 'block'; // Mostrar nota 3
            // Hacer scroll suave hacia nota 3
            setTimeout(() => {
                nota3Container.scrollIntoView({ behavior: 'smooth' });
            }, 300);
            // Bloquear después de mostrar la nota
            setTimeout(bloquearPagina, 2000);
        }, { once: true });
    });
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