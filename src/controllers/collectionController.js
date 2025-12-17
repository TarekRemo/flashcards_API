import {db} from "../db/database.js"; 
import {collections} from "../db/schema.js"
import { request, response } from 'express'
import {eq} from 'drizzle-orm';

export const getCollections = async (req, res) => {
	 try{
        const result = await db
            .select()
            .from(collections)
			.where(eq(collections.userId, req.user.id))
            .orderBy('created_at', 'desc')

        res.status(200).json(result);
    }
	catch (error){
		res.status(500).json({message: "Error retrieving questions", error: error.message});
	}
}

export const createCollection = (req, res) => {
	const { question, answer } = req.body

	if (!question || !answer) {
		res.status(400).send({ message: 'Question and answer are required' })
	}

	res.status(201).send({ message: 'Question created' })
}

export const deleteCollection = (req, res) => {
	const { id } = req.params

	res.status(200).send({ message: `Question ${id} deleted` })
}
