import {z} from 'zod';

export const createFlashcardSchema = z.object({
    collectionId : z.uuid(),
    recto : z.string().min(1).max(512, "Recto must be at most 512 characters"),
    verso : z.string().min(1).max(512, "Verso must be at most 512 characters"),
    versoUrl : z.string().url().max(512).optional(),
    rectoUrl : z.string().url().max(512).optional(),
});

export const updateFlashcardSchema = z.object({
    id : z.uuid(),
    recto : z.string().min(1).max(512, "Recto must be at most 512 characters").optional(),
    verso : z.string().min(1).max(512, "Verso must be at most 512 characters").optional(),
    versoUrl : z.string().url().max(512).optional(),
    rectoUrl : z.string().url().max(512).optional(),
});