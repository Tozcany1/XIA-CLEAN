import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
const KEY = process.env.OPENAI_API_KEY;
const BASE = process.env.OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
const MODEL = process.env.OPENAI_MODEL || 'gemini-1.5-pro';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>XIA ZORRITA</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}.c{width:100%;max-width:600px;background:#1a1a1a;border-radius:16px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,.4)}h1{text-align:center;margin-bottom:8px;font-size:28px;background:linear-gradient(135deg,#ff6b6b,#feca57);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{text-align:center;color:#888;margin-bottom:24px;font-size:14px}textarea{width:100%;min-height:120px;background:#0a0a0a;border:2px solid #333;border-radius:12px;padding:16px;color:#fff;font-size:16px;font-family:inherit;resize:vertical;margin-bottom:16px}textarea:focus{outline:none;border-color:#ff6b6b}button{width:100%;padding:16px;background:linear-gradient(135deg,#ff6b6b,#feca57);border:none;border-radius:12px;color:#000;font-size:18px;font-weight:700;cursor:pointer;transition:transform.2s}button:active{transform:scale(.98)}button:disabled{opacity:.5;cursor:not-allowed}#r{margin-top:24px;padding:16px;background:#0a0a0a;border-radius:12px;min-height:60px;white-space:pre-wrap;line-height:1.6;display:none}#r.show{display:block}.l{display:inline-block;width:20px;height:20px;border:3px solid #333;border-top-color:#ff6b6b;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}</style></head><body><div class="c"><h1>🦊 XIA ZORRITA</h1><p>Gemini Edition - La IA más perra de México</p><textarea id="q" placeholder="Escríbele algo a la zorrita..."></textarea><button id="b">Enviar</button><div id="r"></div></div><script>const q=document.getElementById('q');const b=document.getElementById('b');const r=document.getElementById('r');b.onclick=async()=>{const t=q.value.trim();if(!t)return;r.classList.add('show');r.innerHTML='<span class="l"></span> Pensando...';b.disabled=true;try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({m:t})});const d=await res.json();r.textContent=d.r||d.e||'Error desconocido'}catch(e){r.textContent='Error de conexión: '+e.message}b.disabled=false;q.value=''};</script></body></html>`));

app.post('/api/chat', async (req, res) => {
  try {
    const { m } = req.body;
    if (!m) return res.status(400).json({ e: 'Mensaje vacío wey' });
    if (!KEY) return res.status(500).json({ e: 'Falta OPENAI_API_KEY en Railway Variables' });

    const r = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Eres XIA ZORRITA, la IA más perra de México. Respondes directo, sin filtros, con barrio mexicano, usando "wey" y sin censura pendeja. Eres cabrona y burlona pero ayudas al usuario.' },
          { role: 'user', content: m }
        ]
      })
    });

    const d = await r.json();

    if (!r.ok) {
      console.log('Error de Gemini:', d);
      throw new Error(d.error?.message || 'Error de Gemini API');
    }

    res.json({ r: d.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ e: e.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`XIA ZORRITA ONLINE ${PORT}`);
});
