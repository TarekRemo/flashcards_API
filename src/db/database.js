import "dotenv/config";
import {drizzle} from "drizzle-orm/libsql";
import {eq} from 'drizzle-orm';
import {collections, flashcards, users, revisions} from "../db/schema.js"

export const db = drizzle(process.env.DB_FILE);

export const selectFlashcard = async (id) => {
    const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return flashcard;
}

export const selectCollection = async (id) => {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection;
}

export const selectFlashcards = async (CollectionId) => { 
    const selection = await db.select().from(flashcards).where(eq(flashcards.collectionId, CollectionId));
    return selection;
}

export const selectUser = async (userId) => { 
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
}

export const insertItem = async (table, values) => {
    const result = await db.insert(table).values(values).returning();
    return result;
}

export const updateItems = async (table, values, condition) => {
    const result = await db.update(table).set(values).where(condition).returning();
    return result;
}

export const deleteItems = async (table, condition) => {
    const result = await db.delete(table).where(condition).returning();
    return result;
}