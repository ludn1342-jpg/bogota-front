import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir archivos estáticos (imágenes, CSS, etc.)
app.use(express.static(__dirname, {
    // Excluimos sede.html del estático para que lo procese la ruta de abajo
    index: false, 
    setHeaders: (res, path) => {
        if (path.endsWith('sede.html')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
}));

// 2. Ruta especial para sede.html (Inyecta la URL del backend)
app.get('/sede.html', (req, res) => {
    const filePath = path.join(__dirname, 'sede.html');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo sede.html:', err);
            return res.status(500).send('Error cargando la página');
        }
        
        // Leemos la variable de entorno de Render
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        
        console.log(`[sede.html] Inyectando BACKEND_URL: ${backendUrl}`);
        
        // Reemplazamos el marcador
        const htmlFinal = data.replace('%%BACKEND_URL%%', backendUrl);
        
        res.send(htmlFinal);
    });
});

// 3. Servir el index normalmente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Fallback para cualquier otra ruta (opcional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend corriendo en puerto ${PORT}`);
    console.log(`BACKEND_URL configurada: ${process.env.BACKEND_URL || 'NO CONFIGURADA'}`);
});
