import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log("=================================");
console.log("🚀 INICIANDO FRONTEND");
console.log("BACKEND_URL:", process.env.BACKEND_URL || "❌ NO CONFIGURADA");
console.log("=================================");

// 1. Servir archivos estáticos (imágenes, CSS, HTML sin procesar)
app.use(express.static(__dirname));

// 2. Endpoint que genera dinámicamente el archivo config.js
app.get('/config.js', (req, res) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    console.log(`[/config.js] Sirviendo BACKEND_URL: ${backendUrl}`);
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`window.BACKEND_URL = "${backendUrl}";`);
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend corriendo en puerto ${PORT}`);
});
