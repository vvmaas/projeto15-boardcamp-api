import { Router } from "express";
import { listGames, postGame } from "../controllers/games.controller.js";

const gamesRouter = Router()

gamesRouter.get('/games', listGames)
gamesRouter.post('/games', postGame)

export default gamesRouter