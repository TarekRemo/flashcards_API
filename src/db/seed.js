import {db} from './database.js';
import {users, collections, flashcards, revisions} from './schema.js';
import bcrypt from 'bcrypt';

const seed = async () => {
    console.log('Starting database seeding...'); 

    try{
        console.log('deleting existing data...'); 
        await db.delete(users); 
        await db.delete(collections); 
        await db.delete(flashcards); 
        await db.delete(revisions);
        
        console.log('hashing password...'); 
        const password = await bcrypt.hash('password', 12);
        
        const SeedUsers = [
            {
                email: 'tarek@gmail.com',
                firstName: 'tarek',
                lastName: 'remo',
                password: password,
                isAdmin: true
                
            },
            {
                email: 'mathis@gmail.com',
                firstName: 'mathis',
                lastName: 'berot',
                password: password,
                isAdmin: false
            },
            {
                email: 'lukas@gmail.com',
                firstName: 'lukas',
                lastName: 'fortin',
                password: password,
                isAdmin: true
            },
        ]; 

        console.log('Inserting users...'); 
        const insertedUsers = await db.insert(users).values(SeedUsers).returning();

        const SeedCollections = [
            {
                userId: insertedUsers[0].id,
                title: 'Informatique',
                description : 'Collection info',
                isPrivate : true
            },
            {
                userId: insertedUsers[1].id,
                title: 'Histoire',
                description : 'Collection histoire',
                isPrivate : false
            }
        ]; 

        console.log('Inserting collections...'); 
        const insertedCollections = await db.insert(collections).values(SeedCollections).returning();

        const SeedFlashcards = [
            {
                collectionId: insertedCollections[0].id,
                recto: 'Qu\'est ce qu\'Express ?',
                verso : 'C\'est un framework de Javascript.',
                versoUrl : 'https://dev.to/kaliacad/meilleures-pratiques-pour-creer-une-application-expressjs-583g',
                rectoUrl : 'https://dev.to/kaliacad/meilleures-pratiques-pour-creer-une-application-expressjs-583g'
            },
            {
                collectionId: insertedCollections[1].id,
                recto: 'Quand a eu lieu la révolution française ?',
                verso : 'En 1789',
                versoUrl : 'https://www.radiofrance.fr/franceculture/les-sept-jours-durant-lesquels-s-est-jouee-la-revolution-francaise-6863093',
            }
        ]; 

        console.log('Inserting flashcards...');
        const insertedFlashcards = await db.insert(flashcards).values(SeedFlashcards).returning();

        const SeedRevisions = [
            {
                userId: insertedUsers[0].id,
                flashcardId: insertedFlashcards[0].id,
                level : 2,
                lastReview: new Date()
            },
            {
                userId: insertedUsers[2].id,
                flashcardId: insertedFlashcards[1].id,
                level : 3,
                lastReview: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ]; 

        console.log('Inserting revisions...');
        const insertedRevisions = await db.insert(revisions).values(SeedRevisions).returning();

        console.log('Database seeded successfully'); 
        console.log('email : ' + insertedUsers[0].email); 
        console.log('first_name : ' + insertedUsers[0].firstName); 
        console.log('password : password'); 
    }   
    catch(error){
        console.log(error);
    }
}


seed();