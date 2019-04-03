/**
 * Created by Shiva
 */
'use strict'
import mongoose from 'mongoose';
const config = require('../config/config.json');

let db;

//const DBConnectMongoose = function() {
    const DBConnectMongoose = ()=>{
    return new Promise((resolve, reject) =>{
        if (db) {
            return db;
        }
        mongoose.Promise = global.Promise;

        /*database connection 
          To avoid URL string parser use
          newUrlParse:true.
        */
        let db_env = {
            useNewUrlParser: true
        }
        let live_db = 'mongodb://' + config.db_config.host + ":" + config.db_config.port + "/" + config.db_config.name;
        mongoose.connect(live_db, db_env)
            .then(() => {
                resolve(db);
            })
            .catch(err => {
                console.log('error creating db connection: ' + err);
                reject(db);
            });
    });
};

export default DBConnectMongoose;