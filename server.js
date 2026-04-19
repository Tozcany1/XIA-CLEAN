import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// =========================
// 🎯 Lógica quiniela
// =========================
function analizarPartido(local, visitante) {
  const probLocal = Math.floor(Math.random() * 50) + 30;
  const probVisit = 100 - probLocal - 10;
  const probEmpate = 10;

  let ganador = "Empate";
  if (probLocal > probVisit) ganador = local;
  if (probVisit > probLocal) ganador = visitante;

  return { local, visitante, probLocal, probVisit, probEmpate, ganador };
}

// =========================
// 🌐 Frontend: XIA CLEAN APP
// =========================
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>XIA CLEAN</title>
      <meta name="theme-color" content="#000000"/>
      <link rel="manifest" href="/manifest.json">
      <style>
        body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 20px auto; padding: 15px; background: #0f0f0f; color: #fff; }
        h1 { text-align: center; }
        textarea { width: 100%; height: 120px; margin: 10px 0; padding: 12px; border-radius: 8px; border: 1px solid #333; background: #1a1a1a; color: #fff; box-sizing: border-box; }
        button { padding: 14px; width: 100%; border-radius: 8px; border: none; background: #fff; color: #000; font-weight: bold; font-size: 16px; }
        button:disabled { background: #444; color: #888; }
        #respuesta { margin-top: 20px; padding: 15px; background: #1a1a1a; border-radius: 8px; white-space: pre-wrap; min-height: 50px; }
      </style>
    </head>
    <body>
      <h1>XIA CLEAN</h1>
      <textarea id="mensaje" placeholder="Pregúntame algo..."></textarea>
      <button id="enviar">Enviar</button>
      <div id="respuesta"></div>

      <script>
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js');
        }

        document.getElementById('enviar').onclick = async () => {
          const mensaje = document.getElementById('mensaje').value;
          const btn = document.getElementById('enviar');
          const resDiv = document.getElementById('respuesta');
          if (!mensaje) return;

          btn.disabled = true;
          btn.innerText = 'Pensando...';
          resDiv.innerText = '';

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: mensaje })
            });
            const data = await res.json();
            resDiv.innerText = data.reply;
            document.getElementById('mensaje').value = '';
          } catch (e) {
            resDiv.innerText = 'Error: No se pudo conectar';
          }
          btn.disabled = false;
          btn.innerText = 'Enviar';
        }
      </script>
    </body>
    </html>
  `);
});

// =========================
// 🤖 Quiniela
// =========================
app.post("/api/quiniela", (req, res) => {
  try {
    const { texto } = req.body;
    const lineas = texto.split("\\n").filter(l => l.includes("vs")).slice(0, 15);
    let resultados = [];
    for (let linea of lineas) {
      const [local, visitante] = linea.split("vs").map(t => t.trim());
      const analisis = analizarPartido(local, visitante
