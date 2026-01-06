export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, phone } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing name or phone" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Missing Supabase env vars");
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/appointments`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
