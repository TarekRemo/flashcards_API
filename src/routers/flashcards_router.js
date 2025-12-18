import { Router } from "express";
import { getAllFlashcards, getFlashcard, createFlashcard } from "../controllers/flashcards_controller.js";
import { validateBody } from "../middlewares/validation.js";
import { flashcardSchema } from "../models/flashcards.js";
import { authorize } from "../middlewares/authorization.js";

const flashcardsRouter = Router();

flashcardsRouter.get("/all/:collectionId", authorize, getAllFlashcards);
flashcardsRouter.get("/:id", authorize, getFlashcard);
flashcardsRouter.post("/", authorize, validateBody(flashcardSchema), createFlashcard);

export default flashcardsRouter;