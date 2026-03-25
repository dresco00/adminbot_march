import express from 'express';
import {getall, createStudent} from '../controllers/student.controller.js';

const route = express.Router();

route.get('/students', getall);
route.post('/students', createStudent);

export default route;