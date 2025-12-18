import {db} from "../db/database.js"; 
import {collections, flashcards, users} from "../db/schema.js"
import { request, response } from 'express'
import {eq} from 'drizzle-orm';

/**
 * 
 * @param {response} res 
 */
const checkReadingRightsOnCollection = async (collectionId, userId, res) => {
        var selection = await db
            .select()
            .from(collections)
            .where(eq(collections.id, collectionId));

        if(selection.length === 0){
            res.status(404).send({
                error: 'Collection not found'
            });
            return false;
        }

        const collection = selection[0];

        selection = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

        if(selection.length === 0){
            res.status(404).send({
                error: 'Connected User not found'
            });
            return false;
        }

        const user = selection[0];

        if(user.isAdmin){
            return true;
        }

        if(collection.isPrivate){
            if(collection.userId !== userId){
                res.status(403).send({
                    error: 'Access denied to this private collection'
                });
                return false;
            }
        }
        return true;
};

export const getAllFlashcards = async (req, res) => {
    try{        
        const {collectionId} = req.params;
        const {userId} = req.user;

        if(! await checkReadingRightsOnCollection(collectionId, userId, res)){
        return;
        }
        const result = await db
        .select()
        .from(flashcards)
        .where(eq(flashcards.collectionId, collectionId));

        res.status(200).json(result);
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
}; 

export const getFlashcard = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;

        const selection = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.id, id));

        if(selection.length === 0){
            return res.status(404).send({
                error: 'Flashcard not found'
            });  
        }
        const flashcard = selection[0];

        const collectionId = flashcard.collectionId;
        if(! await checkReadingRightsOnCollection(collectionId, userId, res)){
            return;
        }

        res.status(200).json(flashcard);
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
}; 

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const createFlashcard = async (req, res)=>{
    const { collectionId, recto, verso, rectoUrl, versoUrl } = req.body;
    const {userId} = req.user;

    try{
        const selection = await db
            .select()
            .from(collections)
            .where(eq(collections.id, collectionId));

         if(selection.length === 0){
            return res.status(404).send({
                error: 'Collection not found'
            });
        }

        const collection = selection[0];

        if(collection.userId !== userId){
            return res.status(403).send({
                error: 'You do not have rights to add flashcards to this collection'
            });
        }

        const result = await db
            .insert(flashcards)
            .values({
                collectionId,
                recto,
                verso,
                rectoUrl,
                versoUrl
            })
            .returning();

        return res.status(201).json({
            message: 'flashcard created',
            data: result,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: "Internal server error"
        });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const deleteFlashcard = async (req, res) => {
    const {id} = req.params;
     try{

        const [deleted] = await db.delete(Flashcards).where(eq(Flashcards.id, id)).returning();
        if(!deleted){
            return res.status(404).json({
                message: 'flashcard not found',
                data: deleted,
            });
        }

        return res.status(200).json({
            message: 'flashcard created',
            data: result,
        });
        
    }
    catch(err){
        res.status(500).send({
            error: err.message
        });
    }   
}