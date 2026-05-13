import express from "express";
import { sendMessage } from "./whatsapp.controllers.js";

const router = express.Router();

router.post("/send", sendMessage);

export default router;
