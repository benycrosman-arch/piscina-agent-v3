import { createClient } from '@supabase/supabase-js'

// Substitua pelos dados do seu projeto Supabase
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbWdkc25hd2hiZWRzdWhqYXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ1Mzg1NSwiZXhwIjoyMDgzMDI5ODU1fQ.l1L3jpUVngINRIfBtGsJ-74wWdR75p_pyGMSE_f3KrA'
const supabase = createClient(supabaseUrl, supabaseKey)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, phone, address, date, time, transcript } = req.body

      if (!name || !phone || !address || !date || !time) {
        return res.status(400).json({ error: 'Faltando campos obrigatórios' })
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          { name, phone, address, date, time, transcript }
        ])

      if (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao salvar no Supabase' })
      }

      return res.status(200).json({ success: true, data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro no servidor' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
