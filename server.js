import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// =========================
// 🤖 Endpoint de Chat con IA
// =========================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = (process.env.OPENAI_API_KEY || '').trim();

    if (!apiKey) {
      return res.json({ reply: 'Error: Falta la OPENAI_API_KEY en Railway.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://xia-clean-production.up.railway.app',
        'X-Title': 'XIA CLEAN'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (data.error ||!data.choices ||!data.choices[0]) {
      return res.json({ reply: 'Error OpenRouter: ' + (data.error?.message || 'Sin respuesta') });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: 'Error: ' + error.message });
  }
});

// =========================
// 🌐 Frontend: XIA CLEAN APP
// =========================
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XIA CLEAN</title>
  <style>
    body {
