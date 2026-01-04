import { createClient } from '@supabase/supabase-js'

// Supabase info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'YOUR_SERVICE_ROLE_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

// This ensures Vercel parses JSON automatically
export const config = {
  api: {
    bodyParser: true
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, age, date_for_appointment, time_for_appointment, transcript } = req.body

  // Now we can finally check required fields
  if (!name || !phone || !age || !date_for_appointment || !time_for_appointment) {
    return res.status(400).json({ error: 'Missing required fields', received: req.body })
  }

  const { data, error } = await supabase
    .from('appointments') // make sure your table is appointments
    .insert([{ name, phone, age, date_for_appointment, time_for_appointment, transcript }])
    .select()

  if (error) {
    return res.status(500).json({ error: 'Supabase insert failed', details: error })
  }

  return res.status(200).json({ success: true, appointment: data[0] })
}
