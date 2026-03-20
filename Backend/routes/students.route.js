import express from 'express';
import { getStudent, createStudent } from '../controllers/student.controller.js';

const route = express.Router();

route.get('/student', getStudent);
route.post('/student', createStudent);

export default route;
