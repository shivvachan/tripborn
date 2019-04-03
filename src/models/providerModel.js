import db_tools from "../tools/db_tools";
import mongoose from "mongoose";

let db = db_tools();
let providerSchema = new mongoose.Schema({

    providename:{type:String},

    email : {type:String},

    mobile : {type:String},

    status : {type:String},

    providerDesc : {type:String},

    providerBnFee : {type:String},

    created_on: {
        type: Date,
        default: Date.now
    }
})

let providerDB = mongoose.model('providers', providerSchema);


let globalSettingSchema  = new mongoose.Schema({
    name : {type:String},

    bnFee : {type:String}
})


const createProvider = (providerData)=> {
    let providers = new providerDB(providerData);
    return new Promise(function(resolve, reject) {
        providers.save()
            .then(providersDbResponse => {
                resolve(providersDbResponse)
            })
            .catch(err => {
                reject(err);
            })
    })
}

let listProvider = ()=>{
    return new Promise((resolve,reject)=>{
        providerDB.find()
            .then(response =>{
                resolve(response);
            }).catch(err =>{
                reject(err);
            })
    })
}

let updateProvider = (updatedData)=>{
    return new Promise((resolve,reject)=>{

        proverDB
    })
}


export {
    createProvider,
    listProvider,
    updateProvider
}