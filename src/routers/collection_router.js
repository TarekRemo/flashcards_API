import { Router } from "express";
import {
    createCollection,
    deleteCollection,
    getCollections,
} from '../controllers/collectionController.js'


const collectionRouter = Router();

collectionRouter.get('/', getCollections)
collectionRouter.post('/', createCollection)
collectionRouter.delete('/:id', deleteCollection)

export default collectionRouter;