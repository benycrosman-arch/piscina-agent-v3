import { createClient } from '@supabase/supabase-js'

// Substitua pelos dados do seu projeto Supabase
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'COLOQUE_SUA_SERVICE_ROLE_KEY_AQUI' // service_role_key
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { name, phone, address, date, time, transcript } = req.body

  if (!name || !phone || !address || !date || !time) {
    return res.status(400).json({ error: 'Faltando campos obrigatórios' })
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ name, phone, address, date, time, transcript }])

    if (error) {
      console.error('Erro Supabase:', error)
      return res.status(500).json({ error: 'Erro ao salvar no Supabase' })
    }

    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('Erro Servidor:', err)
    return res.status(500).json({ error: 'Erro no servidor' })
  }
}
