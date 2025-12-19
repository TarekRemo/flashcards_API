import {z} from 'zod';

export const revisionSchema = z.object({
    flashcardId : z.uuid(),
    level : z.number().min(0).max(10),
});