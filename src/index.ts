//imports
// const express = require('express');
// const mongoose = require("mongoose");
const cors = require('cors');
import express from "express";
import mongoose from "mongoose";
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
mongoose.connect(process.env.MONGO_CON_STRING, {useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true}, (err: any)=>{
    if(err) throw err;
    console.log("Mongo db connection established");
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//setup routes
import studentRoutes from './routes/student';
import teacherRoutes from './routes/teacher';
import courseRoutes from './routes/course';

app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/course", courseRoutes);