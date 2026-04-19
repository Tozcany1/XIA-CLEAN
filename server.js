import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("XIA CLEAN funcionando con IA");
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error conectando a la IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
