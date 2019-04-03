import db_tools from "../tools/db_tools";
import mongoose from "mongoose";

let db = db_tools();

let globalSettingSchema  = new mongoose.Schema({
    name : {type:String},
    
    bnFee : {type:String}
})

let globalSetting = mongoose.model('globalsettings', globalSettingSchema);


let findGlobalBnFee = ()=>{
    return new Promise((resolve,reject)=>{
        globalSetting.findOne()
        .then(dbResponse =>{
                resolve(dbResponse)
        }).catch(err =>{
                reject(err)
            })
    })
}


export {
    findGlobalBnFee
}