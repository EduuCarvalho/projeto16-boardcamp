import connection from "../database/db.js";

export async function getCustomers(req,res){

    const {cpf} = req.query;
    try {
        if (cpf){
            const cpfQuery = await connection.query(
                `SELECT * FROM customers WHERE (cpf) LIKE $1;`,[cpf+"%"]
            )
            res.send(cpfQuery.rows)
        }
    const customers = await connection.query("SELECT * FROM customers;")
    res.send(customers.rows);
    }catch (err) {
        res.sendStatus(500);
    }
}

export async function getCustomersByID (req,res){
    const {id} = req.params;

    const checkID = await connection.query(`SELECT * FROM customers WHERE id='${id}';`)
    if (checkID.rows.length <= 0){
        return res.sendStatus(404);
    }


    try {const customer = await connection.query("SELECT * FROM customers WHERE id=$1",[id]);
    res.send(customer.rows[0]);
} catch (err) {
    res.sendStatus(500);
}

}

export async function postCustomers(req,res){
    const {name,phone,cpf,birthday} = req.body;
try{
    
    const checkCPF = await connection.query(`SELECT * FROM customers WHERE cpf='${cpf}'`)
    if(checkCPF.rows.length>0){
        return res.sendStatus(409);
    }

    const customer = await connection.query(
        `INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)`,[name,phone,cpf,birthday]
    )
    res.send(customer.rows);
    }catch(err){
        res.sendStatus(500);
    }

}

export async function updateCustomers(req,res){
    const {name,phone,cpf,birthday} = req.body;
    const { id } = req.params;

    try{
        await connection.query(
            "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5" ,[name,phone,cpf,birthday,id]
        )
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }

}
