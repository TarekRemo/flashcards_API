import {request, response} from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/database.js';
import {users} from '../db/schema.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; 
import {eq} from 'drizzle-orm';


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const register = async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;

        //verify if user already exists
        const [user] = await db.select().from(users).
                            where(eq(
                                users.email, email
                            )); 

        if(user){
            return res.status(409).json({
                error: "A user with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [ newUser ] = await db.insert(users).values({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })
        .returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt
        });

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'User created',
            userData: newUser,
            token: token
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const [user] = await db.select().from(users).
                            where(eq(
                                users.email, email
                            )); 

        if(!user){
            return res.status(404).json({
                error: "user not found"
            });
        }
            
        const rightPassword = bcrypt.compareSync(password, user.password);
        if(! rightPassword){
            return res.status(401).json({
                error: "wrong password"
            });
        }

        const token = jwt.sign( {userId: user.id} , process.env.JWT_SECRET, {expiresIn: '24h'});

        return res.status(200).json({
            message: "Logged in successfully",
            userData: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            token: token
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}


