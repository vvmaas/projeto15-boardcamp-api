import connection from '../database/db.js'

async function listCustomers(req,res) {
    try {
        const customers = await connection.query('SELECT * FROM customers;')
        res.send(customers.rows)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function findCustomerById(req,res) {
    const id = req.params.id

    try {
        const customer = await connection.query(`SELECT * FROM customers WHERE id=${id};`)
        if(!customer.rows[0]){
            return res.sendStatus(404)
        }

        res.send(customer.rows[0])
    } catch (error) {
        res.sendStatus(500)
    }
}

async function postCustomer(req,res) {
    const customer = req.body

    const checkCpf = await connection.query(`SELECT * FROM customers WHERE cpf='${customer.cpf}';`)
    if(customer.cpf.length !== 11 || customer.phone.length > 11 || customer.phone.length < 10 || customer.name === ""){
        return res.sendStatus(400)
    }
    if(checkCpf.rows.length > 0){
        return res.sendStatus(409)
    }

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${customer.name}', '${customer.phone}', '${customer.cpf}', '${customer.birthday}')`)

        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function updateCustomer(req,res) {
    const id = req.params.id
    const customer = req.body

    const checkCpf = await connection.query(`SELECT * FROM customers WHERE cpf='${customer.cpf}';`)
    
    if(customer.cpf.length !== 11 || customer.phone.length > 11 || customer.phone.length < 10 || customer.name === ""){
        return res.sendStatus(400)
    }

    if(checkCpf.rows.length > 0 && checkCpf.rows[0].id !== Number(id)){
        return res.sendStatus(409)
    }

    try {
        await connection.query(`UPDATE customers SET name='${customer.name}', phone='${customer.phone}', cpf='${customer.cpf}', birthday='${customer.birthday}' WHERE id=${id}`)

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {listCustomers, findCustomerById, postCustomer, updateCustomer}