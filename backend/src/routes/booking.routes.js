import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

const servicosDisponiveis = {
    Banho: 1,
    Tosquia: 2,
    Hospedagem: 24,
    Adestramento: 2
};


router.post('/me/createbooking', verifyToken, async (req, res) => {
    const { data, hora, service, animalId } = req.body;
    const userId = req.user.id;

    console.log("📩 Body recebido no createbooking:", req.body);

    if (!service || !servicosDisponiveis[service]) {
        return res.status(400).json({ message: `Serviço inválido: ${service}` });
    }

    const startDate = new Date(`${data}T${hora}:00`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + servicosDisponiveis[service]);

    try {
        const booking = await prisma.booking.create({
            data: {
                startDate,
                endDate,
                service,
                animalId,
                userId
            }
        });

        res.status(201).json({ message: 'Marcação criada com sucesso', booking });
    } catch (err) {
        console.error('Erro ao criar marcação:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

router.get('/me/bookings', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { animal: true }, // assumindo que booking tem relação com animal
        });
        res.json(bookings);
    } catch (err) {
        console.error('Erro ao buscar marcações:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});



export default router;