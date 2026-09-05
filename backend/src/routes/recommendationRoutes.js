import express from "express";
import { recommendMovies, couplesMatch } from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/", recommendMovies);
router.post("/couples-match", couplesMatch);

export default router;