import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir archivos estáticos (imágenes, etc.)
// Esto hace que `alfa.png` se cargue correctamente desde cualquier ruta.
app.use(express.static(__dirname));

// 2. Función para inyectar la variable de entorno en los HTML
const serveHtml = (req, res, next) => {
    // Si el archivo tiene extensión (ej. .png, .css), pasamos al siguiente middleware
    if (path.extname(req.path)) {
        return next();
    }

    // Si la ruta es "/", cargamos index.html. Si no, intentamos cargar la ruta con .html
    let fileName = req.path === '/' ? 'index.html' : `${req.path.replace('/', '')}.html`;
    const filePath = path.join(__dirname, fileName);

    // Verificamos si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si no existe, por defecto mostramos el index
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        // Leemos el HTML y reemplazamos el marcador
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error cargando la página');
            
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const htmlFinal = data.replace('%%BACKEND_URL%%', backendUrl);
            
            res.send(htmlFinal);
        });
    });
};

// 3. Usamos esta función para todas las rutas que no sean archivos estáticos
app.use(serveHtml);

app.listen(PORT, () => {
    console.log(`Frontend corriendo en puerto ${PORT}`);
});
