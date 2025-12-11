import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";
import {randomUUID} from "crypto";

export const users = sqliteTable('users', {
    id: text()
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    email: text().notNull().unique(),
    firstName: text('first_name', {length: 30}).notNull(),
    lastName: text('last_name', {length: 30}).notNull(),
    password: text({length: 255}).notNull(),
    isAdmin: integer('is_admin', {mode: 'boolean'}).default(false),
    createdAt: integer('created_at', {mode: 'timestamp'}).$defaultFn( () => new Date() )
}); 

export const collections = sqliteTable('collections', {
    id: text().
        primaryKey().
        $defaultFn(() => randomUUID() ),
    userId: text('user_id').
            references(() => users.id, {onDelete: 'cascade'})
            .notNull(),
    title: text({length: 255}).notNull(),
    description: text({length: 512}),
    isPrivate: integer('is_private', {mode: 'boolean'}).default(true),
    createdAt: integer('created_at', {mode: 'timestamp'}).$defaultFn( () => new Date()),
});

export const flashcards = sqliteTable('flashcards', {
    id: text().
        primaryKey().
        $defaultFn(() => randomUUID() ),
    collectionId: text('collection_id').
            references(() => collections.id, {onDelete: 'cascade'})
            .notNull(),
    recto: text({length: 512}).notNull(),
    verso: text({length: 512}).notNull(),
    versoUrl: text('verso_url', {length: 255}),
    rectoUrl: text('recto_url', {length: 255}),
});

export const revisions = sqliteTable('revisions', {
    id: text().
        primaryKey().
        $defaultFn(() => randomUUID() ),
    userId: text('user_id').
            references(() => users.id, {onDelete: 'cascade'})
            .notNull(),
    flashcardId: text('flashcard_id').
        references(() => flashcards.id, {onDelete: 'cascade'})
        .notNull(),
    level: integer({enum: [1, 2, 3, 4, 5]}).notNull(),
    lastReview: integer('last_review', {mode: 'timestamp'}).notNull()
});