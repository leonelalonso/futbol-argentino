const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configurar carpeta pública
app.use(express.static(path.join(__dirname)));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
