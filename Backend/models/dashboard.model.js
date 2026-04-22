import db from '../config/db.js';

export const getDashboardData = async () => {
    const [students] = await db.query(
        `SELECT COUNT(*) AS total FROM students`
    );

    const [pendingpayments] = await db.query(
        `SELECT COUNT(*) AS total FROM accounts_receivable WHERE status = 'pending'`
    );

    const [absencesToday] = await db.query(
        `SELECT COUNT(*) AS total FROM attendance WHERE attendance_date = date('now') AND status = 'absent'`
    );

    return {
        totalStudents: students[0].total,
        pendingPayments: pendingpayments[0].total,
        absencesToday: absencesToday[0].total
    };
};

export const getDashboardDataByUserId = async (userId) => {

    const [students] = await db.query(
        `SELECT COUNT(*) AS total FROM students`,
        [userId]
    )

    const [pendingpayments] = await db.query(
        `SELECT COUNT(*) AS total FROM accounts_receivable WHERE status = 'pending'`,
        [userId]
    )

    const [absencesToday] = await db.query(
        `SELECT COUNT(*) AS total FROM attendance WHERE attendance_date = date('now') AND status = 'absent'`,
        [userId]
    );

    return {
        totalStudents: students[0].total,
        pendingPayments: pendingpayments[0].total,
        absencesToday: absencesToday[0].total
    }



}