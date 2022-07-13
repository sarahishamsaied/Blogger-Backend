const express = require('express');
require("dotenv").config();
const initConnection = require("./Database/config");
const {userRoutes} = require("./Routes/routes");
const app = express()
app.use(express.json());
const port = process.env.PORT
app.use(userRoutes)
app.get('/', (req, res) => res.send('Hello World!'))
initConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))