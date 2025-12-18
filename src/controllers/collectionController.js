import {db} from "../db/database.js"; 
import {collections} from "../db/schema.js"
import { request, response } from 'express'
import {eq, desc} from 'drizzle-orm';

export const getCollections = async (req, res) => {
    const { userId } = req.user
	 try{
        const result = await db
            .select()
            .from(collections)
			.where(eq(collections.userId, userId))
            .orderBy(desc(collections.createdAt))

        res.status(200).json(result);
    }
	catch (error){
		res.status(500).json({message: "Error retrieving questions", error: error.message});
	}
}

export const createCollection = async (req, res) => {
	const { title, description, isPrivate } = req.body
    const { userId } = req.user

	if (!title || !description) {
		res.status(400).send({ message: 'Title and description are required' })
	}

	try {
        const [newCollection] = await db.insert(collections).values({
			userId,
            title,
            description,
            isPrivate,
        }).returning()

        res.status(201).json({
            message: 'Collection created',
            data: newCollection,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Failed to create collection'
        })
    }
}

export const deleteCollection = async (req, res) => {
	const { id } = req.params

	res.status(200).send({ message: `Question ${id} deleted` })

	     try{
        const [deleted] = await db.delete(collections).where(eq(collections.id, id)).returning();
        if(!deleted){
            return res.status(404).json({
                message: 'Collection not found',
                data: deleted,
            });
        }

        return res.status(200).json({
            message: 'Collection deleted',
            data: deleted,
        });
        
    }
    catch(err){
        res.status(500).send({
            error: err.message
        });
    }   
}

