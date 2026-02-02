
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
console.log(PORT);

app.use(express.json());
app.use(cors())

app.use(helmet());
app.use(morgan('dev'));

app.use(async (req,res,next) => {
    try {
        const decision = await aj.protect(req,{
            requested:1
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({message: 'Too many requests - rate limit exceeded'});
            }else if(decision.reason.isBot()){
                res.status(403).json({message: 'Access denied - bot detected'});
            }else{
                res.status(403).json({message: 'Access denied'});
        }
        return
    }
    if(decision.result.some((result)=>result.reason.isBot() && result.reason.isSpoofed())){
        res.status(403).json({error: "Spoofed bot detected"});
        return;
    }
    next();
    } catch (error) {
        console.error('Arcjet protection error:', error);
        next(error);

    }
});



app.use('/api/products', productRoutes);




async function initDB() {
    try {
     await sql `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    console.log("Database initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

