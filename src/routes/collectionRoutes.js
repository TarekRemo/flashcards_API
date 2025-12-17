import { Router } from 'express'
import {
	createCollection,
	deleteCollection,
	getCollections,
} from '../controllers/collectionController'

const router = Router()

router.get('/', getCollections)
router.post('/', createCollection)
router.delete('/:id', deleteCollection)

export default router