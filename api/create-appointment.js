import { createClient } from '@supabase/supabase-js'

// Supabase info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbWdkc25hd2hiZWRzdWhqYXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ1Mzg1NSwiZXhwIjoyMDgzMDI5ODU1fQ.l1L3jpUVngINRIfBtGsJ-74wWdR75p_pyGMSE_f3KrA
'

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
