import express from "express";

import categoriesRouters from "./routes/categories.routes.js";
import gamesRouters from "./routes/games.routes.js"
import customersRouters from "./routes/customers.routes.js";

const app = express();
app.use(express.json());
app.use(categoriesRouters);
app.use(gamesRouters);
app.use(customersRouters);


const port = process.env.PORT || 4000;
app.listen(port,()=> console.log(`Server running in port ${port}`));




