import { Router } from "express";
import {listCategories, postCategory} from '../controllers/categories.controller.js'

const categoriesRouter = Router()

categoriesRouter.get('/categories', listCategories)
categoriesRouter.post('/categories', postCategory)

export default categoriesRouter