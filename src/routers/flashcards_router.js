import { Router } from "express";
import { getAllFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, getFlashcardsToRevise, createRevision} from "../controllers/flashcards_controller.js";
import { validateBody } from "../middlewares/validation.js";
import { createFlashcardSchema, updateFlashcardSchema } from "../models/flashcards.js";
import { revisionSchema } from "../models/revisions.js";
import { authorize } from "../middlewares/authorization.js";

const flashcardsRouter = Router();

flashcardsRouter.get("/all/:collectionId", authorize, getAllFlashcards);
flashcardsRouter.get("/:id", authorize, getFlashcard);
flashcardsRouter.get("/revision/:collectionId", authorize, getFlashcardsToRevise);

flashcardsRouter.post("/", authorize, validateBody(createFlashcardSchema), createFlashcard);

flashcardsRouter.put("/revision", authorize, validateBody(revisionSchema), createRevision);
flashcardsRouter.put("/", authorize, validateBody(updateFlashcardSchema), updateFlashcard);

flashcardsRouter.delete("/:id", authorize, deleteFlashcard);

export default flashcardsRouter;