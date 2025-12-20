import {db} from "../db/database.js"; 
import {collections, flashcards, users, revisions} from "../db/schema.js"
import { request, response } from 'express'
import {eq, and} from 'drizzle-orm';

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

export const updateFlashcard = async (req, res) => {
    const { id, recto, verso, rectoUrl, versoUrl } = req.body;
    const {userId} = req.user;

    try{
        var selection = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.id, id));
            
        if(selection.length === 0){
            return res.status(404).json({
                message: 'flashcard not found',
            });
        }

        const flashcard = selection[0];

        selection = await db
            .select()
            .from(collections)
            .where(eq(collections.id, flashcard.collectionId));

        const collection = selection[0];

        if(collection.userId !== userId){
            return res.status(403).json({
                message: 'You do not have rights to update flashcards from this collection',
            });
        }

        const [updated] = await db
            .update(flashcards)
            .set({
                recto : recto ? recto : flashcard.recto,
                verso : verso ? verso : flashcard.verso,
                rectoUrl : rectoUrl ? rectoUrl : flashcard.rectoUrl,
                versoUrl : versoUrl ? versoUrl : flashcard.versoUrl
            })
            .where(eq(flashcards.id, id))
            .returning();
            
        return res.status(200).json({
            message: 'flashcard updated successfully',
            data: updated,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: "internal server error"
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
        var selection = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.id, id));

        if(selection.length === 0){
            return res.status(404).json({
                message: 'flashcard not found',
            });
        }

        const flashcard = selection[0];

        selection = await db
            .select()
            .from(collections)
            .where(eq(collections.id, flashcard.collectionId));

        const collection = selection[0];
        const {userId} = req.user;

        if(collection.userId !== userId){
            return res.status(403).json({
                message: 'You do not have rights to delete flashcards from this collection',
            });
        }

        const [deleted] = await db.delete(flashcards).where(eq(flashcards.id, id)).returning();

        if(!deleted){
            return res.status(404).json({
                message: 'flashcard not found',
            });
        }

        return res.status(200).json({
            message: 'flashcard deleted successfully',
            data: deleted,
        });
        
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: "internal server error"
        });
    }   
}

export const getFlashcardsToRevise = async (req, res) => {
    try{
        const {collectionId} = req.params;
        const {userId} = req.user;

        if(! await checkReadingRightsOnCollection(collectionId, userId, res)){
            return;
        }

        var selection = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));
            
        const user = selection[0];

        selection = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.collectionId, collectionId));

        const flashcardsToRevise = [];
        for (const flashcard of selection) {
            if(await hasToBeRevised(flashcard, user)){
                flashcardsToRevise.push(flashcard);
            }
        }
        res.status(200).json(flashcardsToRevise);
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
}

export const createRevision= async (req, res) => {
   const { flashcardId, level } = req.body;
   const { userId } = req.user;
    try {

        var selection = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.id, flashcardId));

        if(selection.length === 0){
            return res.status(404).send({
                error: 'Flashcard not found'
            });
        }

        const collectionId = selection[0].collectionId;

        if(! await checkReadingRightsOnCollection(collectionId, userId, res)){
            return;
        }

        selection = await db
            .select()
            .from(revisions)
            .where(
                and(
                    eq(revisions.flashcardId, flashcardId),
                    eq(revisions.userId, userId)
                )
            );

        if(selection.length > 0){
            const [updated] = await db
                .update(revisions)
                .set({
                    level,
                    lastReview: new Date()
                })
                .where(
                    and(
                        eq(revisions.flashcardId, flashcardId),
                        eq(revisions.userId, userId)
                    )
                )
                .returning();

            return res.status(200).json({
                message: 'review updated',
                data: updated,
            });
        }

        const result = await db
            .insert(revisions)
            .values({
                flashcardId,
                userId,
                level,
                lastReview: new Date()
            })
            .returning();
        res.status(201).json({
            message: 'review created',
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

const hasToBeRevised = async (flashcard, user) => {
    
    var selection = await db
        .select()
        .from(revisions)
        .where(
            and(
                eq(revisions.flashcardId, flashcard.id),
                eq(revisions.userId, user.id)
            )
        );

    for (const revision of selection) {
        const lastReviewDate = new Date(revision.lastReview);
        const now = new Date();

        const diffTime = now - lastReviewDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if(diffDays < 0)
            return false;

        var intervalDays;
        switch(revision.level){
            case 1:
                intervalDays = 1;
                break;
            case 2:
                intervalDays = 2;
                break;
            case 3:
                intervalDays = 4;
                break;
            case 4:
                intervalDays = 8;
                break;
            case 5:
                intervalDays = 16;
                break;
        }

        if(diffDays >= intervalDays){
            return true;
        }

    }
    return false;
}