const multer = require('multer');
const path = require('path');

// Configurar el almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName);
    }
});

// Configurar el middleware de multer
const upload = multer({ storage: storage }).single('file');

// Controlador para manejar la carga de archivos
exports.uploadImg = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Error de Multer al cargar el archivo
            return res.status(500).json({ error: err.message });
        } else if (err) {
            // Otro error al cargar el archivo
            return res.status(500).json({ error: 'Error al cargar el archivo.' });
        }

        // Archivo cargado exitosamente
        const uploadedFile = req.file;
        if (uploadedFile) {
            const fileUrl = path.join(__dirname, uploadedFile.path);
            return res.json({ fileUrl });
        } else {
            return res.status(400).json({ error: 'No se ha cargado ningún archivo.' });
        }
    });
};