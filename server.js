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
        body { font-family
