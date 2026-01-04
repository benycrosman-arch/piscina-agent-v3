import { createClient } from '@supabase/supabase-js'

// Supabase project info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'YOUR_SERVICE_ROLE_KEY'  // use service role key

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Make sure JSON is parsed
  if (req.method === 'POST') {
    try {
      // Log the raw body
      console.log('Raw request body:', req.body)

      // Extract fields
      const { name, phone, age, date_for_appointment, time_for_appointment, transcript } = req.body || {}

      // Validation
      if (!name || !phone || !age || !date_for_appointment || !time_for_appointment) {
        console.log('Validation failed. Received:', req.body)
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('appointments') // check table name
        .insert([{ name, phone, age, date_for_appointment, time_for_appointment, transcript }])
        .select() // return inserted row

      if (error) {
        console.error('Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to save appointment', details: error })
      }

      return res.status(200).json({ success: true, appointment: data[0] })
    } catch (err) {
      console.error('Server error:', err)
      return res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
