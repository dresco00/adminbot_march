import mysql2 from 'mysql2/promise';

const db = mysql2.createPool({
    host: "",
    user: "",
    password: "",
    database: "",
});

export default db;
    