const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Ruta de inicio
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de la Biblioteca',
  });
});

// Middleware para manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});


// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;