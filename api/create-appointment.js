import { createClient } from '@supabase/supabase-js'

// Supabase info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbWdkc25hd2hiZWRzdWhqYXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ1Mzg1NSwiZXhwIjoyMDgzMDI5ODU1fQ.l1L3jpUVngINRIfBtGsJ-74wWdR75p_pyGMSE_f3KrA' // must be Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body
  try {
    // Parse JSON in case req.body is a string
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  // Destructure expected fields
  const { name, phone, age, date_for_appointment, time_for_appointment, transcript } = body

  // Check all required fields
  if (!name || !phone || !age || !date_for_appointment || !time_for_appointment) {
    return res.status(400).json({ error: 'Missing required fields', received: body })
  }

  // Insert into Supabase
  const { data, error } = await supabase
    .from('appointments') // make sure this table exists
    .insert([{ name, phone, age, date_for_appointment, time_for_appointment, transcript }])
    .select() // return inserted row

  if (error) {
    return res.status(500).json({ error: 'Supabase insert failed', details: error })
  }

  return res.status(200).json({ success: true, appointment: data[0] })
}
