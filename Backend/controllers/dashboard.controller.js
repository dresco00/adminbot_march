import { getDashboardData } from "../models/dashboard.model.js";

export const getDashboard = async (req, res) => {
    try {
        const data = await getDashboardData();

        return res.status(200).json({
            ok: true,
            dashboard: data
        });
    } catch (err) {
        res.status(500).json({
            message: "error al cargar el dashboard",
            error: err
        });
    }
};