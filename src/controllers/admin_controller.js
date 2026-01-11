import {request, response} from 'express';
import { selectUser, selectUsers, deleteItems } from '../db/database.js';
import {eq} from 'drizzle-orm';
import {users} from '../db/schema.js';
import 'dotenv/config'; 

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getAllUsers = async (req, res) => {
    try{
        const {userId} = req.user;
        const requestingUser = await selectUser(userId);

        if(!requestingUser || !requestingUser.isAdmin){
            return res.status(403).send({
                error: 'You do not have rights to view all users'
            });
        }

        const users = await selectUsers();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({
            error: 'An error occurred while retrieving users'
        }); 
    }
};

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUser = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const requestingUser = await selectUser(userId);

        if(!requestingUser || !requestingUser.isAdmin ){
            return res.status(403).send({
                error: 'You do not have rights to view this user'
            });
        }

        const user = await selectUser(id);
        if(!user){
            return res.status(404).send({
                error: 'User not found'
            });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            error: 'An error occurred while retrieving the user'
        }); 
    }
};

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const deleteUser = async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.user;
        const requestingUser = await selectUser(userId);

        if(!requestingUser || !requestingUser.isAdmin ){
            return res.status(403).send({
                error: 'You do not have rights to delete this user'
            });
        }

        const user = await selectUser(id);
        if(!user){
            return res.status(404).send({
                error: 'User not found'
            });
        }

        const result = await deleteItems(users, eq(users.id,id));
        if( !result || result.length === 0){
            return res.status(500).send({
                error: 'Failed to delete the user'
            });
        }

        res.status(200).send({
            message: 'User deleted successfully',
            user: result[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: 'An error occurred while deleting the user'
        }); 
    }
};
