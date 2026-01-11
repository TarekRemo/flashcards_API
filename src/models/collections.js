import {z} from 'zod';

export const createCollectionScheama = z.object({
    title : z.string().min(1).max(128, "Title must be at most 128 characters"),
    description : z.string().min(1).max(512, "Description must be at most 512 characters"),
    isPrivate : z.boolean().default(false),
});

export const updateCollectionSchema = z.object({
    id : z.uuid(),
    title : z.string().min(1).max(128, "Title must be at most 128 characters").optional(),
    description : z.string().min(1).max(512, "Description must be at most 512 characters").optional(),
    isPrivate : z.boolean().default(false).optional(),
});