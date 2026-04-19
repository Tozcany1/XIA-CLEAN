import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

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
// 🌐 Ruta simple (sin HTML largo)
// =========================
app.get("/", (req, res) => {
  res.send("Servidor activo");
});

// =========================
// 🤖 Quiniela
// =========================
app.post("/api/quiniela", (req, res) => {
  try {
    const { texto } = req.body;

    const lineas = texto.split("\n").filter(l => l.includes("vs")).slice(0, 15);

    let resultados = [];

    for (let linea of lineas) {
      const [local, visitante] = linea.split("vs").map(t => t.trim());
      const analisis = analizarPartido(local, visitante);

      resultados.push(
        `${analisis.local} vs ${analisis.visitante}
Local: ${analisis.probLocal}%
Visitante: ${analisis.probVisit}%
Empate: ${analisis.probEmpate}%
Ganador: ${analisis.ganador}\n`
      );
    }

    res.json({ resultado: resultados.join("\n") });

  } catch (e) {
    res.json({ resultado: "Error" });
  }
});

// =========================
// 💬 Chat IA
// =========================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

  } catch {
    res.json({ reply: "Error IA" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
