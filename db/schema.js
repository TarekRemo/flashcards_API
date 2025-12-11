import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";
import {randomUUID} from "crypto";

export const users = sqliteTable('users', {
    id: text()
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    email: text().notNull().unique(),
    first_name: text({length: 30}).notNull(),
    last_name: text({length: 30}).notNull(),
    password: text({length: 255}).notNull(),
    is_admin: integer({mode: 'boolean'}).default(false),
    createdAt: integer('created_at', {mode: 'timestamp'}).$defaultFn( () => new Date())
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
    userId: text('user_id').
            primaryKey().
            references(() => users.id, {onDelete: 'cascade'})
            .notNull(),
    flashcardID: text('flashcard_id').
        primaryKey().
        references(() => flashcards.id, {onDelete: 'cascade'})
        .notNull(),
    level: integer({enum: [1, 2, 3, 4, 5]}).notNull(),f
    last_review: date()
});