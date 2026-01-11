import { Router } from "express";
import {
    createCollection,
    deleteCollection,
    getCollections,
    getCollection, updateCollection, searchPublicCollections
} from '../controllers/collectionController.js'
import { authorize } from "../middlewares/authorization.js";
import {validateBody} from "../middlewares/validation.js";
import {createCollectionScheama, updateCollectionSchema} from "../models/collections.js";


const collectionRouter = Router();

collectionRouter.get('/search', searchPublicCollections);

collectionRouter.use(authorize);

collectionRouter.get('/', getCollections)
collectionRouter.get('/:id', getCollection)

collectionRouter.post('/', validateBody(createCollectionScheama), createCollection)

collectionRouter.put("/", validateBody(updateCollectionSchema), updateCollection);

collectionRouter.delete('/:id', deleteCollection)

export default collectionRouter;