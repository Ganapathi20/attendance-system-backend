const { response } = require("express");

const getStudent = async (request, response)=>{
    return response.status(400).json({name: "Pratik Gupta", batch:"Btech 2017 CSE"});
}

module.exports = {
    getStudent
}