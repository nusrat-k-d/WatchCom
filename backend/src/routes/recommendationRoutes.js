import express from "express";
import { recommendMovies } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/", recommendMovies);
router.post("/", recommendMovies);

export default router;