import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("RAW BODY:", req.body);

    const {
      name,
      phone,
      age,
      date_for_appointment,
      time_for_appointment,
      transcript,
    } = req.body;

    if (
      !name ||
      !phone ||
      age === undefined ||
      !date_for_appointment ||
      !time_for_appointment
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
      });
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          name,
          phone,
          age,
          date_for_appointment,
          time_for_appointment,
          transcript,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({
        error: "Supabase insert failed",
        details: error,
      });
    }

    return res.status(200).json({
      success: true,
      appointment: data,
    });
  } catch (err) {
    console.error("SERVER CRASH:", err);
    return res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
}
