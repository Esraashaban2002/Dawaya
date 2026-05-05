const express = require("express");
require("dotenv").config();
const userRouter = require('./routes/userRouter')
const app = express();

app.use(express.json());


app.use('/api', userRouter)



module.exports = app;