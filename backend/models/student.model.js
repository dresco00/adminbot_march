import db from '../config/db.js';

export const getall = async () => {
    const [rows] = await db.query('SELECT * FROM estudiantes');
    return rows;
};

export const create = async (data) => {
    const {id, code_students, 
        first_name,
         last_name, 
         number_document, 
         birthday, grade, 
         selective_grade} = data;
    const [result] = await db.query(`INSERT INTO estudiantes (id, code_students, first_name, last_name, number_document, birthday, grade, selective_grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, code_students, first_name, last_name, number_document, birthday, grade, selective_grade]);
    return result;
};