import http from "http";

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.AI_API_KEY;
const PROVIDER = process.env.AI_PROVIDER || "groq";

function send(res, code, data, type = "application/json") {
  res.writeHead(code, { "Content-Type": type });
  res.end(type === "application/json" ? JSON.stringify(data) : data);
}

async function callGroq(message) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "Eres una IA clara, directa y útil." },
        { role: "user", content: message }
      ]
    })
  });
  const j = await r.json();
  return j.choices?.[0]?.message?.content || "Sin respuesta";
}

async function callTogether(message) {
  const r = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3-70b-chat-hf",
      messages: [
        { role: "system", content: "Eres una IA clara, directa y útil." },
        { role: "user", content: message }
      ]
    })
  });
  const j = await r.json();
  return j.choices?.[0]?.message?.content || "Sin respuesta";
}

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/") {
    return send(res, 200, "IA corriendo", "text/plain");
  }

  // Chat endpoint
  if (req.method === "POST" && req.url === "/chat") {
    let body = "";
    req.on("data", c => (body += c.toString()));
    req.on("end", async () => {
      try {
        if (!API_KEY) return send(res, 500, { error: "Falta AI_API_KEY" });

        const { message } = JSON.parse(body || "{}");
        if (!message) return send(res, 400, { error: "Falta 'message'" });

        let reply;
        if (PROVIDER === "together") {
          reply = await callTogether(message);
        } else {
          reply = await callGroq(message); // default
        }

        return send(res, 200, { reply });
      } catch (e) {
        return send(res, 500, { error: "Error interno" });
      }
    });
    return;
  }

  // 404
  return send(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor en puerto " + PORT);
});
