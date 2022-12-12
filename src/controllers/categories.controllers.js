import  connection  from "../database/db.js";

export async function getCategories (req,res){
    try{
    const categorias = await connection.query('SELECT * FROM categories;')
    res.send(categorias.rows)
    }catch(err){
        res.sendStatus(500);
    }
}

export async function postCategories (req,res){
    const {name} = req.body;
    try{
    if (!name){
        return res.sendStatus(400)
    }
    const checkCategorie = await connection.query(`SELECT * FROM categories WHERE name='${name}';`)
    if (checkCategorie.rows.length>0){
        return res.sendStatus(409);
    }

    const categoria = await connection.query(
        "INSERT INTO categories (name) VALUES ($1)",[name]);

    res.sendStatus(201);
    }catch(err){
        res.sendStatus(500);
    }
};