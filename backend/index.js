import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './src/routes/auth.routes.js';
import authUser from './src/routes/user.routes.js';
import 'dotenv/config';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', authUser);

app.listen(3001, () => console.log('Backend a correr na porta 3001'));
