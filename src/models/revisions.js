import {z} from 'zod';

export const revisionSchema = z.object({
    flashcardId : z.uuid(),
    level : z.number().min(1).max(5),
});