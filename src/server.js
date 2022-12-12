import express from "express";
import pkg from 'pg';

const {Pool} = pkg;

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456gm',
    database: 'boardcamp'
})

const app = express();
app.use(express.json());



app.get('/categories', async (req,res)=>{
    const categorias = await connection.query('SELECT * FROM categories;')
    res.send(categorias.rows)
})

app.post('/categories', async (req,res)=>{
    const {name} = req.body;
    if (!name){
        return res.sendStatus(400)
    }
    const checkCategorie = await connection.query(`SELECT * FROM categories WHERE name='${name}';`)
    if (checkCategorie.rows.length>0){
        return res.sendStatus(409);
    }

    const categoria = await connection.query(
        "INSERT INTO categories (name) VALUES ($1)",[name]);

    res.send(categoria);
})

app.get ('/games', async (req,res)=>{
    const games = await connection.query('SELECT * FROM games;')
    res.send(games.rows);
})




const port = process.env.PORT || 4000;
app.listen(port,()=> console.log(`Server running in port ${port}`));
