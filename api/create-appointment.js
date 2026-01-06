import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔥 MANUAL RAW BODY READ (THIS IS THE KEY)
    let rawBody = "";

    await new Promise((resolve, reject) => {
      req.on("data", chunk => {
        rawBody += chunk;
      });
      req.on("end", resolve);
      req.on("error", reject);
    });

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({
        error: "Invalid JSON",
        received: rawBody
      });
    }

    const name =
      body.name ||
      body.nome ||
      body.user_name ||
      body.full_name;

    const phone =
      body.phone ||
      body.telefone ||
      body.phone_number;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Missing required fields",
        received: body
      });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Supabase env vars not configured");
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/appointments`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({ name, phone })
      }
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    return res.status(200).json({
      success: true,
      appointment: JSON.parse(text)
    });

  } catch (error) {
    console.error("create-appointment error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
