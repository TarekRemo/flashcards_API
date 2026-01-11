import express from 'express';
import 'dotenv/config';
import authRouter from './routers/auth_router.js';
import flashcardsRouter from './routers/flashcards_router.js';
import adminRouter from './routers/admin_router.js';
import  logger  from './middlewares/logger.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(logger);
app.use('/auth', authRouter);

app.use('/flashcard', flashcardsRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});