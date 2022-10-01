import { Router } from "express";
import { listCustomers, findCustomerById, postCustomer, updateCustomer } from "../controllers/customers.controller.js";

const customersRouter = Router()

customersRouter.get('/customers', listCustomers)
customersRouter.get('/customers/:id', findCustomerById)
customersRouter.post('/customers', postCustomer)
customersRouter.put('/customers/:id', updateCustomer)

export default customersRouter