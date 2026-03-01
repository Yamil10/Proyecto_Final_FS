require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Importamos la conexión para probarla

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/facturas', require('./routes/invoice.routes'));

// Middleware GLOBAL de errores
app.use((err, req, res, next) => {
    console.error("🔥 Error del servidor:", err.message);
    res.status(500).json({ mensaje: 'Ocurrió un error interno', detalle: err.message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`\n🚀 Servidor backend Express encendido en el puerto ${PORT}`);
        
        try {
            // Forzamos un "toque" a la base de datos para ver si responde
            const connection = await pool.getConnection();
            console.log('✅ Conexión a MySQL Workbench exitosa!');
            connection.release(); // La soltamos para que no consuma memoria
        } catch (error) {
            console.error('❌ Error fatal al conectar con MySQL:');
            console.error('Revisa tu usuario y contraseña en el archivo .env');
            console.error('Detalle técnico:', error.message);
        }
        console.log('--------------------------------------------------\n');
    });
}

module.exports = app;