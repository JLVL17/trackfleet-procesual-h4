const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const { Ollama } = require('ollama')

const app = express()
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'trackfleet_h4',
})
const ollama = new Ollama({ host: 'http://localhost:11434' })
const systemPrompt = 'Eres el asistente virtual de TrackFleet. Responde ÚNICA Y EXCLUSIVAMENTE preguntas relacionadas con la gestión de flotas, vehículos, conductores y el sistema TrackFleet. Si el usuario pregunta cualquier otra cosa, dile amablemente que solo puedes responder sobre TrackFleet'

app.use(cors())
app.use(express.json())

app.get('/api/vehiculos', async (_req, res) => {
  try {
    const [vehiculos] = await db.query(
      'SELECT id, placa, modelo, estado FROM vehiculos ORDER BY id',
    )
    res.json(vehiculos)
  } catch (error) {
    console.error('Error al consultar vehículos:', error)
    res.status(500).json({ error: 'No se pudieron consultar los vehículos.' })
  }
})

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Escribe un mensaje para el asistente.' })
  }

  try {
    const response = await ollama.chat({
      model: 'llama3.2',
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message.trim() },
      ],
    })
    res.json({ reply: response.message.content })
  } catch (error) {
    console.error('Error al consultar Ollama:', error)
    res.status(502).json({ error: 'No se pudo obtener una respuesta de Ollama.' })
  }
})

app.listen(3000, () => {
  console.log('TrackFleet escucha en http://localhost:3000')
})
