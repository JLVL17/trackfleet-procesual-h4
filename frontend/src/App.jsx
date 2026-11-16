import { useEffect, useState } from 'react'

const api = 'http://localhost:3000/api'
const panel = {
  background: '#fff',
  border: '1px solid #dbe4ee',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
}
const cell = { padding: '10px 12px', borderBottom: '1px solid #dbe4ee' }

export default function App() {
  const [vehiculos, setVehiculos] = useState(null)
  const [vehicleError, setVehicleError] = useState('')
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatError, setChatError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadVehicles() {
      try {
        const response = await fetch(`${api}/vehiculos`, { signal: controller.signal })
        if (!response.ok) throw new Error()
        setVehiculos(await response.json())
      } catch {
        if (!controller.signal.aborted) setVehicleError('No se pudieron cargar los vehículos.')
      }
    }

    loadVehicles()
    return () => controller.abort()
  }, [])

  async function sendMessage(event) {
    event.preventDefault()
    const message = input.trim()
    if (isLoading || !message) return

    setHistory((previous) => [...previous, { role: 'user', content: message }])
    setInput('')
    setChatError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${api}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!response.ok) throw new Error()
      const { reply } = await response.json()
      setHistory((previous) => [...previous, { role: 'assistant', content: reply }])
    } catch {
      setChatError('No se pudo obtener una respuesta del asistente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, background: '#f4f7fb', color: '#17263a', textAlign: 'left', colorScheme: 'light' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <h1 style={{ color: 'inherit', fontSize: 32, margin: '0 0 20px' }}>TrackFleet</h1>

        <section style={panel} aria-labelledby="vehicles-title">
          <h2 id="vehicles-title" style={{ color: 'inherit' }}>Vehículos</h2>
          {vehicleError && <p role="alert">{vehicleError}</p>}
          {!vehicleError && vehiculos === null && <p role="status">Cargando vehículos...</p>}
          {vehiculos?.length === 0 && <p>No hay vehículos registrados.</p>}
          {vehiculos?.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#eef3f9' }}>
                  <tr>
                    <th scope="col" style={cell}>ID</th>
                    <th scope="col" style={cell}>Placa</th>
                    <th scope="col" style={cell}>Modelo</th>
                    <th scope="col" style={cell}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map(({ id, placa, modelo, estado }) => (
                    <tr key={id}>
                      <td style={cell}>{id}</td>
                      <td style={cell}>{placa}</td>
                      <td style={cell}>{modelo}</td>
                      <td style={cell}>{estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={panel} aria-labelledby="chat-title">
          <h2 id="chat-title" style={{ color: 'inherit' }}>Asistente de TrackFleet</h2>
          <div role="log" aria-label="Historial del chat" style={{ minHeight: 80, maxHeight: 280, overflowY: 'auto' }}>
            {history.map(({ role, content }, index) => (
              <p key={index} style={{ padding: 10, margin: '6px 0', borderRadius: 8, background: role === 'user' ? '#e8f0ff' : '#f2f5f8', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                <strong>{role === 'user' ? 'Tú' : 'TrackFleet'}</strong>
                {' · '}{content}
              </p>
            ))}
          </div>
          {isLoading && <p role="status">Cargando respuesta...</p>}
          {chatError && <p role="alert">{chatError}</p>}
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              type="text"
              aria-label="Mensaje para el asistente"
              placeholder="Pregunta sobre gestión de flotas"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              style={{ flex: 1, minWidth: 0, padding: 10, border: '1px solid #9cabc0', borderRadius: 8, font: 'inherit' }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{ background: '#174b96', color: '#fff', border: 0, borderRadius: 8, padding: '10px 16px', font: 'inherit' }}
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
