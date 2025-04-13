const express = require('express');
const {Report,createReport}=require("../models/reports");
const { Dbconnection } = require('../config/connectionURI');

const router = express.Router();

// Controller functions
const getReports = async(req, res) => {
    try{

        await Dbconnection()
        const response =await Report.find()
        res.send(response);



    }


    catch(err){

        res.status(500).json({ error: "Server Error" });

    }
    
   
};

const createReportHandler = async(req, res) => {

    
    const{report,createdAt,username}=req.body;
    try{

        await Dbconnection()
        await createReport(report,username,createdAt)
      


        res.status(201).json({ success: "Seccesfully reported" });


    }

    catch(err){
        res.status(500).json({ error: "Server Error" });

    }
   
    
};

const updateReport = (req, res) => {
    // Logic to update a report
    res.send('Update a report');
};

const deleteReport = (req, res) => {
    // Logic to delete a report
    res.send('Delete a report');
};

// Routes
module.exports={deleteReport,updateReport,createReportHandler,getReports}