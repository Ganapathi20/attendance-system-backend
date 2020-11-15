//imports
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const studentRoutes = require('./routes/student');
require("dotenv").config();

//setup express
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server started on port", PORT));
// app.get("/", (request, response, next)=>response.status(400).json({msg: "hello"}));

// setup mongoose
console.log("Mongo con string", process.env.MONGO_CON_STRING);
mongoose.connect(process.env.MONGO_CON_STRING, {useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true}, (err)=>{
    if(err) throw err;
    console.log("Mongo db connection established");
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//setup routes
app.use("/api/student", studentRoutes);