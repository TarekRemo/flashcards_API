import {db, selectFlashcard, selectFlashcards, selectUser, selectCollection,
         insertItem, deleteItems, updateItems} from "../db/database.js"; 
import {flashcards, revisions} from "../db/schema.js"
import {eq, and} from 'drizzle-orm';

const hasReadingRightsOnCollection = async (userId, collectionId, res) => {
    const collection = await selectCollection(collectionId);
    if(!collection){
        res.status(404).send({
            error: 'Collection not found'
        });
        return false;
    }

    const user =  await selectUser(userId);
    if(!user){
        res.status(404).send({
            error: 'User not found'
        });
        return false;
    }

    if(!user.isAdmin && collection.userId !== user.id && collection.isPrivate){
        res.status(403).send({
            error: 'You do not have rights to view this collection'
        });
        return false;
    }
    return true;
};

const hasUpdatingRightsOnCollection = async (userId, collectionId, res) => {
    const collection = await selectCollection(collectionId);

    if(!collection){
        res.status(404).send({
            error: 'Collection not found'
        });
        return false;
    }

    if(collection.userId !== userId){
        res.status(403).send({
            error: 'You do not have rights to update this collection'
        });
        return false;
    }
    return true;
}

export const getAllFlashcards = async (req, res) => {
    try{        
        const {collectionId} = req.params;
        const {userId} = req.user;

        if(! await hasReadingRightsOnCollection(userId, collectionId, res)){
            return; //response already sent in the function
        }

        const result = await selectFlashcards(collectionId);
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

        const flashcard = await selectFlashcard(id);
        if(!flashcard){
            return res.status(404).send({
                error: 'Flashcard not found'
            });  
        }

        if(! await hasReadingRightsOnCollection(userId, flashcard.collectionId, res)){
            return; //response already sent in the function
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

export const createFlashcard = async (req, res)=>{
    try{
        const { collectionId, recto, verso, rectoUrl, versoUrl } = req.body;
        const {userId} = req.user;

        if(! await hasUpdatingRightsOnCollection(userId, collectionId, res)){
            return; //response already sent in the function
        }

        const result = await insertItem(
            flashcards,
            {
                collectionId,
                recto,
                verso,
                rectoUrl,
                versoUrl
            }
        );

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
    try{
        const { id, recto, verso, rectoUrl, versoUrl } = req.body;
        const {userId} = req.user;

        const flashcard = await selectFlashcard(id);
        if(!flashcard){
            return res.status(404).send({
                error: 'Flashcard not found'
            });  
        }

        if(! await hasUpdatingRightsOnCollection(userId, flashcard.collectionId, res)){
            return; //response already sent in the function
        }

        const [updated] = await updateItems(
            flashcards,
            {
                recto : recto ? recto : flashcard.recto,
                verso : verso ? verso : flashcard.verso,
                rectoUrl : rectoUrl ? rectoUrl : flashcard.rectoUrl,
                versoUrl : versoUrl ? versoUrl : flashcard.versoUrl
            },
            eq(flashcards.id, id)
        );
            
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

export const deleteFlashcard = async (req, res) => {
     try{
        const {id} = req.params;
        const {userId} = req.user;

        const flashcard = await selectFlashcard(id);
        if(!flashcard){
            return res.status(404).json({
                message: 'flashcard not found',
            });
        }

        if(! await hasUpdatingRightsOnCollection(userId, flashcard.collectionId, res)){
            return; //response already sent in the function
        }

        const [deleted] = await deleteItems(
            flashcards,
            eq(flashcards.id, id)
        );

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

        if(! await hasReadingRightsOnCollection(userId, collectionId, res) ){
            return;
        }

        const collectionFlashcards = await selectFlashcards(collectionId);
        const userRevisions = await db.select().from(revisions).where(eq(revisions.userId, userId));

        const flashcardsToRevise = [];
        for (const flashcard of collectionFlashcards) {
            const revision = userRevisions.find(r => r.flashcardId === flashcard.id);

            if(revision && hasToBeRevised(revision)){
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

const hasToBeRevised = (revision) => {
    
    const lastReviewDate = new Date(revision.lastReview);
    const now = new Date();

    const diffTime = now - lastReviewDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

    return diffDays >= intervalDays;
}

export const createRevision= async (req, res) => {
    try {
        const { flashcardId, level } = req.body;
        const { userId } = req.user;

        const flashcard = await selectFlashcard(flashcardId);
        if(!flashcard){
            return res.status(404).send({
                error: 'Flashcard not found'
            });  
        }

        const collectionId = flashcard.collectionId;
        if(! await hasReadingRightsOnCollection(userId, collectionId, res)){
            return; //response already sent in the function
        }

        const selection = await db
            .select()
            .from(revisions)
            .where(
                and(
                    eq(revisions.flashcardId, flashcardId),
                    eq(revisions.userId, userId)
                )
            );

        if(selection.length > 0){
            const [updated] = await updateItems(
                revisions,
                {
                    level,
                    lastReview: new Date()
                },
                and(
                    eq(revisions.flashcardId, flashcardId),
                    eq(revisions.userId, userId)
                )
            )

            return res.status(200).json({
                message: 'revision updated',
                data: updated,
            });
        }

        const result = await insertItem(
            revisions,
            {
                flashcardId,
                userId,
                level,
                lastReview: new Date()
            });

        return res.status(201).json({
            message: 'revision created',
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