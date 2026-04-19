import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// 🔑 Pega tu API KEY de OpenRouter aquí
const OPENROUTER_API_KEY = "PON_AQUI_TU_API_KEY";

// 🔥 FUNCIÓN QUINIELA
function calcularProb(nl, nv){
  let diff = nl - nv;
  let pL, pE, pV;

  if(diff >= 2){
    pL = 65; pE = 20; pV = 15;
  } else if(diff <= -2){
    pV = 65; pE = 20; pL = 15;
  } else {
    pL = 40 + diff*5;
    pV = 40 - diff*5;
    pE = 20;
  }

  return {pL, pE, pV};
}

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("XIA CLEAN funcionando");
});

// Ruta de chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // 🔥 DETECTOR DE QUINIELA
    if(userMessage.toLowerCase().includes("vs")){

      const partidos = userMessage.split("\n").filter(p => p.includes("vs"));

      const resultado = partidos.map(p => {
        const [local, visita] = p.split("vs").map(x => x.trim());

        // niveles base (puedes mejorar después)
        const nivelLocal = 3;
        const nivelVisita = 3;

        const { pL, pE, pV } = calcularProb(nivelLocal, nivelVisita);

        let ganador = "Empate";
        if(pL > pV && pL > pE) ganador = local;
        if(pV > pL && pV > pE) ganador = visita;

        return `${local} vs ${visita}
${local}: ${pL}% | Empate: ${pE}% | ${visita}: ${pV}%
👉 ${ganador}`;
      });

      return res.json({ reply: resultado.join("\n\n") });
    }

    // 🤖 SI NO ES QUINIELA → IA NORMAL
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres Shia, una IA experta, directa, precisa y también capaz de programar código correctamente."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "Sin respuesta";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
