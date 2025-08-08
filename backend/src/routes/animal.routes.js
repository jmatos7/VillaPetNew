import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth.middleware.js';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.memoryStorage(); 
const upload = multer({ storage });


router.post('/me/createanimal', verifyToken, upload.single("image"), async (req, res) => {
    const ownerId = req.user.id;
    const { name, breed, age, species } = req.body;

    try {
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "villapet" },
                async (error, result) => {
                    if (error) throw error;

                    imageUrl = result.secure_url;

                    const newAnimal = await prisma.animal.create({
                        data: {
                            name,
                            breed,
                            age: age ? Number(age) : null,
                            species,
                            imageUrl,
                            ownerId
                        }
                    });

                    res.status(201).json({ message: 'Animal criado com sucesso', animal: newAnimal });
                }
            );

            result.end(req.file.buffer); // ← envia o ficheiro da memória
        } else {
            const newAnimal = await prisma.animal.create({
                data: {
                    name,
                    breed,
                    age: age ? Number(age) : null,
                    species,
                    imageUrl: null,
                    ownerId
                }
            });

            res.status(201).json({ message: 'Animal criado com sucesso', animal: newAnimal });
        }
    } catch (err) {
        console.error('Erro ao criar animal:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


router.delete('/me/deleteanimal/:id', verifyToken, async (req, res) => {
    const ownerId = req.user.id; // vem do token decodificado
    const { id } = req.params;
    try {
        const animal = await prisma.animal.findUnique({ where: { id, ownerId } });
        if (!animal) return res.status(404).json({ message: 'Animal não encontrado' });

        await prisma.animal.delete({ where: { id } });
        res.json({ message: 'Animal eliminado com sucesso' });
    } catch (err) {
        console.error('Erro ao eliminar animal:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});




export default router;