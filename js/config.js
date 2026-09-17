// ==========================================
// 🔐 CREDENCIALES DE SUPABASE
// ==========================================
// ⚠️ IMPORTANTE: Usa la clave PÚBLICA (no la secreta)
// En Supabase: Settings > API > Project API Keys > anon (public)
const SUPABASE_URL = "https://fxggbyklrsddwgeaadkb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Z2dieWtscnNkZHdnZWFhZGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDY2OTEsImV4cCI6MjEwMzI4MjY5MX0.aOmCTeflRzhfg2qmY4CKdWis-dcgFtPrVLkA4J7DfLI";

const MENSAJE_CONFIG = {
    titulo: "Mensaje especial",
    subtitulo: "Espero te guste 💝",
    notas: [
    {
        titulo: "Nota 1",
        contenido: 
        "Si llegaste hasta aquí, significa que decidiste abrir este pequeño regalo que preparé para ti.\
        Antes de continuar, quiero que sepas algo: esto no fue hecho para ponerte presión ni para esperar una respuesta de tu parte.\
        Simplemente nació de una forma que tengo de expresar lo que a veces no digo con palabras.\n Sabes... escribir ha sido una manera de guardar momentos, emociones y pensamientos.\
        Esta vez quise transformar algunas de esas palabras en algo diferente.\
        Esta canción nace desde la admiración y el cariño hacia una persona que, de una u otra forma, dejó una huella bonita en mi vida.\
        Escúchala con calma. Espero que la disfrutes tanto como yo disfruté crearla.\n— Leonardo \n Leoncario"
    },
    // LA NOTA 2 CON AUDIO VA AQUÍ (se genera dinámicamente abajo)
    ],
    fraseAudio: "⚠️ Conecta auriculares para continuar", // ← Frase con advertencia
    tituloAudio: "Una canción para ti",
    textoAudio: "Escúchala hasta el final 🎵",

    nota3: {
    titulo: "Nota 3",
    contenido: 
    "Esta canción nació de una admiración sincera hacia la persona que eres, de esos pequeños detalles que quizás para muchos pasan desapercibidos, pero que hacen que alguien sea especial.\
    No hice esto esperando una respuesta ni para poner ningún peso sobre ti.\
    Simplemente quería regalarte algo que salió de mí y que representara lo bonito que ha sido coincidir contigo durante estos años.\
    Me alegra haber conocido a alguien como tú, haber compartido momentos y poder verte comenzar una nueva etapa en tu vida.\
    Espero que nunca dudes de tu valor, que sigas confiando en ti y que nunca pierdas esa esencia que te hace ser tu.\
    La vida puede llevarnos por caminos distintos, pero siempre voy a desearte lo mejor y alegrarme por cada logro que consigas.\
    Y si algún día necesitas una conversación, una ayuda o simplemente alguien que te escuche, sabes que puedes contar conmigo.\
    Gracias por inspirar estas palabras.\
    Con mucho cariño y admiración,\nLeonardo \nLeoncario"
    }
};