import { createClient } from '@supabase/supabase-js'

// Coloque os dados do seu Supabase aqui
const supabaseUrl = 'https://lgmgdsnawhbedsuhjaro.supabase.co'
const supabaseKey = 'COLOQUE_AQUI_SUA_SERVICE_ROLE_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, phone, address, date, time, transcript } = req.body

      // Verifica se campos obrigatórios estão presentes
      if (!name || !phone || !address || !date || !time) {
        return res.status(400).json({ error: 'Faltando campos obrigatórios' })
      }

      // Insere no Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ name, phone, address, date, time, transcript }])

      if (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao salvar no Supabase' })
      }

      // Retorna sucesso
      return res.status(200).json({ success: true, data })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro no servidor' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
