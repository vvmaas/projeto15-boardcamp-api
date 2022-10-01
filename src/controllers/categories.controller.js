import connection from '../database/db.js'

async function listCategories(req,res) {
    try {
        const categories = await connection.query('SELECT * FROM categories;')
        res.send(categories.rows)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function postCategory(req,res) {
    const newCat = req.body
    if (newCat.name === ""){
        return res.sendStatus(400)
    }
    console.log('pass')
    console.log(newCat.name)
    try {
        const taken = await connection.query(`SELECT * FROM categories WHERE name='${newCat.name}';`)
        console.log('pass')
        if(taken.rows.length > 0){
            return res.sendStatus(409)
        }
        await connection.query(`INSERT INTO categories (name) VALUES ('${newCat.name}');`)
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
}

    export {listCategories, postCategory}