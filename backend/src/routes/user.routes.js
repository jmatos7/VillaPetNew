import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/me', verifyToken, async (req, res) => {
  const userId = req.user.id; // vem do token decodificado

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        phone: true,
        animals: {
          select: {
            id: true,
            name: true,
            breed: true,
            age: true,
            species: true,
            imageUrl: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error('Erro ao obter utilizador:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.get('/me/animals', verifyToken, async (req, res) => {
  const ownerId = req.user.id; // vem do token decodificado
  try {
    const animals = await prisma.animal.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        breed: true,
        age: true,
        species: true
      }
    });

    res.json( animals );
  } catch (err) {
    console.error('Erro ao obter animais do utilizador:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }

});

router.put('/me/update-phone', verifyToken, async (req, res) => {
  const userId = req.user.id; // vem do token decodificado
    const { phone, phone2 } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { phone, phone2 }
        });
        res.json({ message: 'Número de telefone atualizado com sucesso', user: updatedUser });
    } catch (err) {
        console.error('Erro ao atualizar telefone:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


export default router;