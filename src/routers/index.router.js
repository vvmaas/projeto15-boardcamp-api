import {Router} from 'express'
import customersRouter from './customers.router.js';
import gamesRouter from './games.router.js';
import rentalsRouter from './rentals.router.js';
import categoriesRouter from './categories.router.js'

const router = Router()
router.use(customersRouter)
router.use(gamesRouter)
router.use(rentalsRouter)
router.use(categoriesRouter)

export default router