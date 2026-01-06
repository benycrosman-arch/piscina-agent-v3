import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Missing required fields: name, phone"
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
        body: JSON.stringify({
          name,
          phone
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${errorText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      appointment: data
    });

  } catch (error) {
    console.error("create-appointment error:", error.message);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
