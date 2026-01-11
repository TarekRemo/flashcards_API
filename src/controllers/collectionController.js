import {
    db,
    deleteItems,
    insertItem,
    selectCollection,
    selectCollections,
    updateItems
} from "../db/database.js";
import {collections} from "../db/schema.js"
import {eq,and, like} from 'drizzle-orm';
import {hasReadingRightsOnCollection, hasUpdatingRightsOnCollection} from "../utils/permissions.js";


export const getCollections = async (req, res) => {
	 try{
         const {userId} = req.user;
        const collections = await selectCollections(userId);

         if(!collections){
             return res.status(404).send({
                 error: 'Flashcard not found'
             });
         }

         res.status(200).json(collections);
    }
     catch(err){
         console.error(err);
         res.status(500).send({
             error: 'Internal server error'
         });
     }
}

export const getCollection = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;

        const collection = await selectCollection(id);
        if(!collection){
            return res.status(404).send({
                error: 'Collection not found'
            });
        }

        if(! await hasReadingRightsOnCollection(userId, collection.id, res)){
            return; //response already sent in the function
        }

        res.status(200).json(collection);
    }
    catch(err){
        console.error(err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
};

export const createCollection = async (req, res)=>{
    try{
        const {userId} = req.user;
        const {title, description, isPrivate} = req.body;

        const result = await insertItem(
            collections,
            {
                userId,
                title,
                description,
                isPrivate
            }
        );

        return res.status(201).json({
            message: 'collection created',
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

export const updateCollection = async (req, res) => {
    try{
        const { id, title, description, isPrivate} = req.body;
        const {userId} = req.user;

        const collection = await selectCollection(id);
        if(!collection){
            return res.status(404).send({
                error: 'Collection not found'
            });
        }

        if(! await hasUpdatingRightsOnCollection(userId, collection.id, res)){
            return;
        }

        const [updated] = await updateItems(
            collections,
            {
                title : title ? title : collection.title,
                description : description ? description : collection.description,
                isPrivate: isPrivate ?? collection.isPrivate,
            },
            eq(collections.id, id)
        );

        return res.status(200).json({
            message: 'collection updated successfully',
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

export const deleteCollection = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;

        const collection = await selectCollection(id);
        if(!collection){
            return res.status(404).json({
                message: 'collection not found',
            });
        }

        if(! await hasUpdatingRightsOnCollection(userId, collection.id, res)){
            return;
        }

        const [deleted] = await deleteItems(
            collections,
            eq(collections.id, id)
        );

        return res.status(200).json({
            message: 'collection deleted successfully',
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

export const searchPublicCollections = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).send({
                error: 'Title query parameter is required'
            });
        }

        const results = await db
            .select()
            .from(collections)
            .where(
                and(
                    eq(collections.isPrivate, false),
                    like(collections.title, `%${title}%`)
                )
            );

        res.status(200).json(results);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
};

