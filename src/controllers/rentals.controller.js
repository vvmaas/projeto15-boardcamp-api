import connection from '../database/db.js'
import dayjs from 'dayjs'

async function listRentals(req,res) {
    let rentals = []
    const customerId = req.query.customerId
    const gameId = req.query.gameId

    try {
        if (gameId && customerId){
            rentals = await connection.query(
                `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE "customerId" = $1 AND gameId" = $2;`,
                [customerId, gameId])
        } else if (gameId) {
            rentals = await connection.query(
                `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE "gameId" = $1;`,
                [gameId])
        } else if (customerId) {
            rentals = await connection.query(
                `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId" WHERE "customerId" = $1;`,
                [customerId])
        } else {
            rentals = await connection.query(
                `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON customers.id=rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id=games."categoryId";`
                )
        }
        
            res.send(rentals.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function postRental(req,res){
    const rental = req.body

    const rentalsAmount = await connection.query(`SELECT * FROM rentals WHERE "gameId"=${rental.gameId}`)
    const game = await connection.query(`SELECT * FROM games WHERE id=${rental.gameId}`)
    const customer = await connection.query(`SELECT * FROM customers WHERE id=${rental.customerId}`)

    if(!customer.rows[0] || !game.rows[0] || rental.daysRented <= 0 || rentalsAmount.rows.length >= game.rows[0].stockTotal){
        return res.sendStatus(400)
    }

    rental.originalPrice = rental.daysRented * game.rows[0].pricePerDay
    rental.rentDate = dayjs().format('YYYY-MM-DD')
    rental.returnDate = null
    rental.delayFee = null

    try {
        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES (${rental.customerId}, ${rental.gameId}, '${rental.rentDate}', ${rental.daysRented}, ${rental.returnDate}, ${rental.originalPrice}, ${rental.delayFee});`)
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

async function endRental(req,res){
    const id = req.params.id
    const rentEnd = new Date('2022-11-02')

    const validId = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]) 
    if(!validId.rows[0]){
        return res.sendStatus(404)
    }
    if(validId.rows[0].returnDate !== null){
        return res.sendStatus(400)
    }
    console.log(new Date())
    const dayPrice = validId.rows[0].originalPrice / validId.rows[0].daysRented
    let difference = rentEnd.getTime() - validId.rows[0].rentDate.getTime()
    let daysDelayed = Math.ceil(difference / (1000 * 3600 * 24)) - validId.rows[0].daysRented

    const delayFee = daysDelayed * dayPrice

    try {
        await connection.query(`UPDATE rentals SET "returnDate"=$1 WHERE id=$2`, [rentEnd, id])
        await connection.query(`UPDATE rentals SET "delayFee"=$1 WHERE id=$2`, [delayFee, id])
        
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }

}

async function deleteRental(req,res) {
    const id = req.params.id
    try {
        const target = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        if(!target.rows[0]){
            return res.sendStatus(404)
        }
        if(target.rows[0].returnDate === null){
            return res.sendStatus(400)
        }
        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {listRentals, postRental, deleteRental, endRental}