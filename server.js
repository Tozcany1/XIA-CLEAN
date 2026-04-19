import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================
// 🎯 Lógica quiniela simple
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
              headers: { "Content
