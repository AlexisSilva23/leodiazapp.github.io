// ==========================================
// 🎧 DETECCIÓN DE AURICULARES (opcional)
// ==========================================
// Uso futuro:
//   <script src="js/auriculares.js"></script>
//   const ok = await hayAuriculares();
//
// Limitaciones conocidas (leer antes de activar):
// - Requiere permiso de micrófono para leer labels. Si se deniega, devuelve false.
// - Safari iOS / Firefox: detección muy pobre o nula.
// - Altavoces Bluetooth pueden contar como "auriculares" (falso positivo).
// - NO usar como bloqueo duro: úsalo como advertencia informativa.

async function hayAuriculares() {
    // 1. Verificar soporte del navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
    }

    // 2. Pedir permiso de micrófono (sin esto, los labels vienen vacíos)
    try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        tempStream.getTracks().forEach(t => t.stop());
    } catch (e) {
        console.warn('[auriculares] Permiso de micrófono denegado, no se puede verificar.');
        return false;
    }

    // 3. Enumerar dispositivos de salida
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputs = devices.filter(d => d.kind === 'audiooutput');

    if (outputs.length === 0) return false;

    // 4. Buscar palabras clave en el label
    const keywords = [
        'headphone', 'headset', 'auricular', 'audífono',
        'earphone', 'earbuds', 'airpods', 'buds'
    ];
    const coincide = outputs.some(d => {
        const label = (d.label || '').toLowerCase();
        return keywords.some(k => label.includes(k));
    });

    // 5. Fallback: más de una salida de audio → probablemente hay auriculares
    return coincide || outputs.length > 1;
}