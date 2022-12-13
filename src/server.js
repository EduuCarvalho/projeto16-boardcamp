import express from "express";
import cors from 'cors'

import categoriesRouters from "./routes/categories.routes.js";
import gamesRouters from "./routes/games.routes.js"
import customersRouters from "./routes/customers.routes.js";
import rentalsRouters from "./routes/rentals.routes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(categoriesRouters);
app.use(gamesRouters);
app.use(customersRouters);
app.use(rentalsRouters);

const port = process.env.PORT || 4000;
app.listen(port,()=> console.log(`Server running in port ${port}`));




