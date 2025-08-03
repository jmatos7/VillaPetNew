import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Registo
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email já usado' });

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        // Opcional: enviar token em cookie HttpOnly
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true em produção com HTTPS

        res.status(201).json({ message: 'Utilizador criado com sucesso' });
    } catch (err) {
        console.error('Erro no registo:', err); // <- Mostra o erro no terminal
        res.status(500).json({ message: 'Erro no servidor', error: err.message }); // <- Envia mensagem real
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Credenciais inválidas' });

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Opcional: enviar token em cookie HttpOnly
        res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true em produção com HTTPS

        res.json({ message: 'Login efetuado', token });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Verificar estado de login
router.get('/check', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Não autenticado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ userId: decoded.userId, email: decoded.email });
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Limpa o cookie do token
    res.json({ message: 'Logout efetuado' });
});

// Middleware para verificar autenticação
router.use((req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Não autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // dados do utilizador
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
});


export default router;
