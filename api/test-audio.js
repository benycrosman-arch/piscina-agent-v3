import fetch from "node-fetch";

// CONFIG
const ELEVEN_API_KEY = "sk_c26e99865f25929f342e764cfe586e14702f9ddb2713b4b5";
const ELEVEN_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
const SUPABASE_URL = "https://lgmgdsnawhbedsuhjaro.supabase.co/functions/v1/smooth-function";
const SUPABASE_KEY = "sb_secret_cv7SCjYZMFFbKlWdH4-1lw_c-65Vm2K";

// TESTE ELEVEN LABS
async function gerarAudio(texto) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: texto })
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  console.log("Audio gerado com sucesso no Eleven Labs");
}

// TESTE SUPABASE
async function salvarNoSupabase() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Beny Crosman",
      age: 12,
      phone: "21999283123",
      date: "2026-01-08",
      time: "16:00"
    })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  console.log("Dados salvos no Supabase");
}

// EXECUÇÃO
(async () => {
  await gerarAudio("Olá Beny, sua consulta foi registrada com sucesso.");
  await salvarNoSupabase();
})();
