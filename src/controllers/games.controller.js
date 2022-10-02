import connection from '../database/db.js'

async function listGames (req,res) {
    let games = []
    try {
        if(req.query.name === undefined){
            games = await connection.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId";`)
        } else {
            games = await connection.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId" WHERE LOWER( games.name ) LIKE '${req.query.name}%';`)
        }
        
        res.send(games.rows)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function postGame(req,res) {

    const game = req.body

    const checkCat = await connection.query(`SELECT * FROM categories WHERE id=${game.categoryId};`)

    if(game.name === "" || game.stockTotal <= 0 || game.pricePerDay <= 0 || checkCat.rows.length <= 0){
        return res.sendStatus(400)
    }

    const taken = await connection.query(`SELECT * FROM games WHERE name='${game.name}';`)
        console.log('pass')
        if(taken.rows.length > 0){
            return res.sendStatus(409)
        }

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${game.name}', '${game.image}', ${game.stockTotal}, ${game.categoryId}, ${game.pricePerDay});`)
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {listGames, postGame}