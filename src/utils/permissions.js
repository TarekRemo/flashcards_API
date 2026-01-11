import {selectCollection, selectUser} from '../db/database.js';

export const hasReadingRightsOnCollection = async (userId, collectionId, res) => {
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

export const hasUpdatingRightsOnCollection = async (userId, collectionId, res) => {
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