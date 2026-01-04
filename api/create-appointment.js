import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbWdkc25hd2hiZWRzdWhqYXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ1Mzg1NSwiZXhwIjoyMDgzMDI5ODU1fQ.l1L3jpUVngINRIfBtGsJ-74wWdR75p_pyGMSE_f3KrA' // Use Service Role Key for full write access

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, phone, age, date, time, transcript } = req.body

      // Simple validation
      if (!name || !phone || !age || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('appointments')  // make sure this matches your table name
        .insert([{ name, phone, age, date, time, transcript }])

      if (error) {
        console.error('Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to save appointment', details: error })
      }

      // Return the inserted row
      return res.status(200).json({ success: true, appointment: data[0] })
    } catch (err) {
      console.error('Server error:', err)
      return res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
