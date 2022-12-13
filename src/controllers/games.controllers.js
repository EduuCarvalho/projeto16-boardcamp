import connection from "../database/db.js";

export async function getGames(req,res){
    const {name} = req.query;

    try{
        if(name){
            const gameQuery = await connection.query(
                `SELECT * FROM games WHERE lower(name) LIKE $1;`,[name.toLowerCase()+"%"]
            )
            return res.send(gameQuery.rows)
        }
        const games = await connection.query('SELECT * FROM games;')
        res.send(games.rows);
    } catch (err) {
        res.sendStatus(500);
    }

}

export async function postGames (req,res){
    const {name , image, stockTotal ,categoryId, pricePerDay} = req.body;
    try{
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
     await connection.query(`INSERT INTO games ("name" , "image", "stockTotal" ,"categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)`,[name , image, stockTotal ,categoryId, pricePerDay])
    res.sendStatus(201);
}catch(err){
    res.sendStatus(500);
}
}