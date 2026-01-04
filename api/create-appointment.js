import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'YOUR_SERVICE_ROLE_KEY' // replace with your service role key
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Make sure the body is parsed as JSON
      const { name, phone, age, date_for_appointment, time_for_appointment, transcript } = JSON.parse(req.body)

      if (!name || !phone || !age || !date_for_appointment || !time_for_appointment) {
        return res.status(400).json({ error: 'Missing required fields', body: req.body })
      }

      const { data, error } = await supabase
        .from('appointments') // or your correct table name
        .insert([{ name, phone, age, date_for_appointment, time_for_appointment, transcript }])

      if (error) {
        console.error('Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to save appointment', details: error })
      }

      return res.status(200).json({ success: true, appointment: data[0] })
    } catch (err) {
      console.error('Server error:', err)
      return res.status(500).json({ error: 'Server error', details: err.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
