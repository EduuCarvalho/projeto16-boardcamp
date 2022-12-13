import connection from "../database/db.js";
import dayjs from "dayjs";


export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    try {
        if (customerId) {
            const customerRentals = await connection.query(
                `
              SELECT rentals.*, customers.name  AS "customerName", games.name AS "gameName", games."categoryId" AS "categoryId", categories."name" AS "categoryName"
      FROM 
        rentals
      JOIN 
          customers
      ON 
        rentals."customerId" = customers.id
        JOIN 
        games
    ON 
      rentals."gameId" = games.id 
      JOIN 
      categories
      ON 
      games."categoryId" = categories.id
              
              WHERE "customerId" = $1;`,
                [customerId]
            );
            const customerRentalsRes = customerRentals.rows.map((r) =>
                rentalObject(r)
            );
            return res.send(customerRentalsRes);
        }
        if (gameId) {
            const gameRentals = await connection.query(
                ` SELECT rentals.*, customers.name  AS "customerName", games.name AS "gameName", games."categoryId" AS "categoryId", categories."name" AS "categoryName"
              FROM 
                rentals
              JOIN 
                  customers
              ON 
                rentals."customerId" = customers.id
                JOIN 
                games
            ON 
              rentals."gameId" = games.id 
              JOIN 
              categories
              ON 
              games."categoryId" = categories.id
               WHERE "gameId" = $1;`,
                [gameId]
            );
            const gameRentalsRes = gameRentals.rows.map((r) =>
                rentalObject(r)
            );
            return res.send(gameRentalsRes);
        }
        const allRentals = await connection.query(
            /*  `SELECT * FROM rentals;` */

            `SELECT rentals.*, customers.name  AS "customerName", games.name AS "gameName", games."categoryId" AS "categoryId", categories."name" AS "categoryName"
      FROM 
        rentals
      JOIN 
          customers
      ON 
        rentals."customerId" = customers.id
        JOIN 
        games
    ON 
      rentals."gameId" = games.id 
      JOIN 
      categories
      ON 
      games."categoryId" = categories.id
        ;`
        );

        const allRentalsRes = allRentals.rows.map((r) => rentalObject(r));
        res.send(allRentalsRes);
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
}



function rentalObject(rental) {
    const {
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
        customerName,
        gameName,
        categoryId,
        categoryName,
    } = rental;

    return {
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
        customer: {
            id: customerId,
            name: customerName,
        },
        game: {
            id: gameId,
            name: gameName,
            categoryId,
            categoryName,
        },
    };
}


export async function postRentals(req, res) {
    /*  {
         id: 1,
         customerId: 1,
         gameId: 1,
         rentDate: '2021-06-20',    // data em que o aluguel foi feito
         daysRented: 3,             // por quantos dias o cliente agendou o aluguel
         returnDate: null,          // data que o cliente devolveu o jogo (null enquanto não devolvido)
         originalPrice: 4500,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
         delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
       } */
    const { customerId, gameId, daysRented } = req.body;

    const isCustomer = await connection.query("SELECT * FROM customers WHERE id=$1", [customerId]);
    if (isCustomer.rows.length === 0) {
        return res.sendStatus(400);
    }

    const isGame = await connection.query("SELECT * FROM games WHERE id=$1", [gameId]);
    if (isGame.rows.length === 0) {
        return res.sendStatus(400);
    }

    if (daysRented <= 0) {
        return res.sendStatus(400);
    }


    try {

        const gameRent = await connection.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        const gamePricePerDay = gameRent.rows[0].pricePerDay;
        const originalPrice = gamePricePerDay * daysRented;
        const rentDate = dayjs().format("YYYY-MM-DD");


        const rental = await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented","rentDate","returnDate","originalPrice","delayFee")
             VALUES ($1, $2, $3,$4,$5,$6,$7)`, [customerId, gameId, daysRented, rentDate, null, originalPrice, null]
        )

        res.send(rental.rows)
    } catch (err) {
        res.sendStatus(404)
    }

}

export async function postRentalsByID(req, res) {


    const { id } = req.params;

    const rental = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if(rental.rows.length===0){
      
        return res.sendStatus(404);
    }

    if(rental.rows[0].returnDate !== null){
        return res.sendStatus(400);
    }
    try {
        let delayFee = 0;

        const rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [id]);
        const rentDate = rental.rows[0].rentDate;
        const daysRented = rental.rows[0].daysRented;
        const timeFinishRent = new Date().getTime() - new Date(rentDate).getTime();

        const daysFinishRent = Math.floor(timeFinishRent / (24 * 3600 * 1000));
        if (daysFinishRent > daysRented) {
            const feeDays = daysFinishRent - daysRented
            delayFee = feeDays * rental.rows[0].originalPrice;

        }
        await connection.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3`,[dayjs().format("YYYY-MM-DD"), delayFee, id]
        );

        res.sendStatus(200);

    } catch (err) {
        console.log("TO AKI")
        console.log(err);
        res.sendStatus(404);
    }

}


export async function deleteRentals(req, res) {
    const { id } = req.params;

    const checkId = await connection.query(
        "SELECT * FROM rentals WHERE id=$1", [id]
    )

    if (checkId.rows.length === 0) {
        return res.sendStatus(404);
    }


    try {
        await connection.query(
            "DELETE FROM rentals WHERE id=$1", [id]
        )
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message);
    }
}