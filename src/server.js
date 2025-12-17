import express from 'express';
import 'dotenv/config';
import authRouter from './routers/auth_router.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});