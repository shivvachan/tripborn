/**
 * Created by Shiva
 */
'use strict';
import express from "express";
import bodyparser from 'body-parser';
import fileUpload from 'express-fileupload';
import async from 'async';
import session from 'express-session';
import cors from 'cors';
import db_tools from './tools/db_tools';

import {} from "dotenv/config";


const app = express();

let {PORT} = process.env;

//Storing SessionID in cookie.
app.use(session({
    secret: 'super.super.secret.shhh',
    key: "sessionID",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }

}));



app.use(cors());


/*file upload if requires */
app.use(fileUpload());

//app.all('/*', function(req, res, next) {
    app.all('/*',(req,res,next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'Content-type,Accept,access-token,X-Key,group_id');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

//Mongo DB Connection
db_tools()
    .then(() => {
        app.set('port', PORT);
        //let server = app.listen(app.get('port'), function() {
            let server = app.listen(app.get('port'),() =>{
            console.log('Express server listening on port ' + PORT);
        })
        let routes = require('./routes/routes');

        // configure app to use bodyParser()
        // this will let us get the data from a POST
        app.use(bodyparser.urlencoded({
            extended: true
        }));
        app.use(bodyparser.json({
            limit: '10mb'
        }));
        
        routes.assignRoutes(app);
    })
    .catch(err => {
        console.log('Error: ' + err);
    })