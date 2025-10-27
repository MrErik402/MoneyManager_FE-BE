const express = require("express");
const cors = require("cors");

const tables = require("./modules/tables");
const logger  = require("./utils/logger");
const app = express();

// Middlewarek
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // req.body-n keresztül átmenjen az adat

app.use("/", tables);

app.listen(3000, () => {
   logger.log('info', 'server listening on port 3000')
});