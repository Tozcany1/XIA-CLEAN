import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================
// 🎯 Lógica quiniela simple
// =========================
function analizarPartido(local, visitante) {
  // lógica básica (puedes mejorar luego)
  const probLocal = Math.floor(Math.random() * 50) + 30; // 30-80
  const probVisit = 100 - probLocal - 10; // deja empate
  const probEmpate = 10;

  let ganador = "Empate";
  if (probLocal > probVisit) ganador = local;
  if (probVisit > probLocal) ganador = visitante;

  return {
    local,
    visitante,
    probLocal,
    probVisit,
    probEmpate,
    ganador
  };
}

// =========================
// 🌐 Interfaz
// =========================
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif">
        <h2>XIA IA - Quinielas</h2>

        <p>Formato: EquipoA vs EquipoB (uno por línea, máx 15)</p>

        <textarea id="partidos" rows="10" cols="50"></textarea><br><br>
        <button onclick="analizar()">Analizar Quiniela</button>

        <h3>Resultados:</h3>
        <pre id="res"></pre>

        <script>
          async function analizar() {
            const texto = document.getElementById("partidos").value;

            const r = await fetch("/api/quiniela", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ texto })
            });

            const data = await r.json();
            document.getElementById("res").innerText = data.resultado;
          }
        </script>
      </body>
    </html>
  `);
});

// =========================
// 🤖 IA + quiniela
// =========================
app.post("/api/quiniela", async (req, res) => {
  try {
    const { texto } = req.body;

    const lineas = texto.split("\\n").filter(l => l.includes("vs")).slice(0, 15);

    let resultados = [];

    for (let linea of lineas) {
      const [local, visitante] = linea.split("vs").map(t => t.trim());

      const analisis = analizarPartido(local, visitante);

      resultados.push(
        \`\${analisis.local} vs \${analisis.visitante}
  Local: \${analisis.probLocal}%
  Visitante: \${analisis.probVisit}%
  Empate: \${analisis.probEmpate}%
  👉 Ganador probable: \${analisis.ganador}\n\`
      );
    }

    res.json({
      resultado: resultados.join("\\n")
    });

  } catch (e) {
    res.json({ resultado: "Error procesando quiniela" });
  }
});

// =========================
// 💬 Chat IA real
// =========================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "Sin respuesta"
    });

  } catch (error) {
    res.json({ reply: "Error IA" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
