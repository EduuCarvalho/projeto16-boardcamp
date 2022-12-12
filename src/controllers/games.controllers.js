import connection from "../database/db.js";

export async function getGames(req,res){
    const games = await connection.query('SELECT * FROM games;')
    res.send(games.rows);
}

export async function postGames (req,res){
    const {name , image, stockTotal ,categoryId, pricePerDay} = req.body;
    if (name == null || name == 'undefined'){
        return res.sendStatus(400)
    }
    if (stockTotal<= 0 || pricePerDay <= 0 ){
        return res.sendStatus(400);
    }
    const checkCategoryId = await connection.query(`SELECT * FROM categories WHERE id='${categoryId}';`)
    if(checkCategoryId.rows.length==0){
        return res.sendStatus(400);
    }
    const checkName = await connection.query(`SELECT * FROM games WHERE name='${name}';`)
    if (checkName.rows.length>0){
        return res.sendStatus(409);
    }
    const game = await connection.query(`INSERT INTO games ("name" , "image", "stockTotal" ,"categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)`,[name , image, stockTotal ,categoryId, pricePerDay])
    res.send(game);
}