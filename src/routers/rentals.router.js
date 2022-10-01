import { Router } from "express";
import { listRentals, postRental, deleteRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals', postRental)
rentalsRouter.post('/rentals/:id/return')
rentalsRouter.delete('/rentals/:id', deleteRental)

export default rentalsRouter