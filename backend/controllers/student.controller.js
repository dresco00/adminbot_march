import {getall, create} from '../models/student.model.js';
import {randomUUID} from 'crypto';

export const getStudent = async (req, res) => {
    try {
        const students = await getall();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error', err: error });
        
    }
};

export const createStudent = async (req, res) => {
    try {
        const newstudent = {
            id: randomUUID(),
            ...req.body
        };

        await create();
        res.status(201).json({ message: 'student created' });

    } catch (error) {
            res.status(500).json({ message: 'ocurrió un error', err: error });
        }
};