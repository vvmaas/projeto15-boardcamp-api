import { Router } from "express";
import { listRentals, postRental, deleteRental, endRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals', postRental)
rentalsRouter.post('/rentals/:id/return', endRental)
rentalsRouter.delete('/rentals/:id', deleteRental)

export default rentalsRouter