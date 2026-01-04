import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project info
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'YOUR_SERVICE_ROLE_KEY' // Use Service Role Key for full write access

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, phone, age, date_for_appointment, time_for_appointment, transcript } = req.body

      // Simple validation
      if (!name || !phone || !age || !date_for_appointment || !time_for_appointment) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('appointments')  // make sure this matches your table name
        .insert([{ name, phone, age, date_for_appointment, time_for_appointment, transcript }])
        .select('name, phone, age, date_for_appointment, time_for_appointment, transcript') // enforce order

      if (error) {
        console.error('Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to save appointment', details: error })
      }

      // Return the inserted row in your preferred column order
      return res.status(200).json({ success: true, appointment: data[0] })
    } catch (err) {
      console.error('Server error:', err)
      return res.status(500).json({ error: 'Server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
