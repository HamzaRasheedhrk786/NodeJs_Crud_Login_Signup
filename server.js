const express = require("express");
const mongoose = require("mongoose");

// aquiring url from CONFIG
const db=require('./CONFIG/dbconfig').mongodbonline;
const app = express();

// acquiring jason format   
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

// connection with database
mongoose.connect(db,{useUnifiedTopology: true, useNewUrlParser : true ,useCreateIndex: true,  useFindAndModify: false}).then( m =>{
    console.log("Database Connected..");

    // get server tracking
    app.get('/',(req,res) => {

        return res.json({msg:"The server is running",success:true}).status(200);
    });

    // acquring rout
    app.use('/auth',require('./routs/auth'));


}) 
.catch( err => {
    console.log(err)
    console.log( "Error In database connectivity...." );
} )


// creating port using env variable
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`App is listening at port ${port}`);
 })