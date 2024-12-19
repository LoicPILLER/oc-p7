const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.memoryStorage();

const upload = multer({ storage }).single('image');

const compressAndSaveImage = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: 'Erreur lors de l\'upload de l\'image.' });
        }

        if (!req.file) {
            return res.status(400).send({ error: 'Aucune image téléchargée.' });
        }

        try {
            const name = req.file.originalname.replace(/\s+/g, '_');
            const filename = `${name}_${Date.now()}.webp`;

            const outputDir = path.join(__dirname, '../images');
            const outputPath = path.join(outputDir, filename);

            await sharp(req.file.buffer)
                .resize(800)
                .toFormat('webp')
                .webp({ quality: 80 })
                .toFile(outputPath);

            req.file.path = outputPath;
            req.file.filename = filename;

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Erreur lors de la compression et de la sauvegarde de l\'image.' });
        }
    });
};

module.exports = compressAndSaveImage;
