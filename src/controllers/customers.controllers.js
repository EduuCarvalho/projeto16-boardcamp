import connection from "../database/db.js";

export async function getCustomers(req,res){
    const customers = await connection.query("SELECT * FROM customers;")
    res.send(customers.rows);
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

}

