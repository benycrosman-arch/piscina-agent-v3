import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

/*
  🔐 Variáveis obrigatórias no .env:

  SUPABASE_URL=https://SEU-PROJETO.supabase.co
  SUPABASE_KEY=SBxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ELEVEN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ELEVEN_VOICE_ID=xxxxxxxxxxxxxxxx
*/

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const ELEVEN_VOICE_ID = process.env.ELEVEN_VOICE_ID;

// =====================
// 1️⃣ Eleven Labs
// =====================
async function gerarAudio() {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: "Teste de áudio funcionando corretamente.",
        model_id: "eleven_turbo_v2_5"
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Erro Eleven Labs: " + err);
  }

  console.log("Áudio gerado com sucesso no Eleven Labs");
}

// =====================
// 2️⃣ Supabase
// =====================
async function salvarNoSupabase() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/appointments`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Teste",
        phone: "11999999999",
      })
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error("Erro Supabase: " + text);
  }

  console.log("Dados salvos no Supabase");
}

// =====================
// 3️⃣ Execução
// =====================
async function main() {
  await gerarAudio();
  await salvarNoSupabase();
}

main().catch(console.error);
