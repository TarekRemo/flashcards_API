import { Router } from "express";
import {getAllFlashcards, getFlashcard, getFlashcardsToRevise, createFlashcard,
         createRevision, updateFlashcard, deleteFlashcard} from "../controllers/flashcards_controller.js";
import { validateBody } from "../middlewares/validation.js";
import { createFlashcardSchema, updateFlashcardSchema } from "../models/flashcards.js";
import { revisionSchema } from "../models/revisions.js";
import { authorize } from "../middlewares/authorization.js";

const flashcardsRouter = Router();

flashcardsRouter.use(authorize);

flashcardsRouter.get("/all/:collectionId", getAllFlashcards);
flashcardsRouter.get("/:id", getFlashcard);
flashcardsRouter.get("/revision/:collectionId", getFlashcardsToRevise);

flashcardsRouter.post("/", validateBody(createFlashcardSchema), createFlashcard);

flashcardsRouter.put("/revision", validateBody(revisionSchema), createRevision);
flashcardsRouter.put("/", validateBody(updateFlashcardSchema), updateFlashcard);

flashcardsRouter.delete("/:id", deleteFlashcard);

export default flashcardsRouter;