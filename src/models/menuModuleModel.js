import db_tools from "../tools/db_tools";
import mongoose from "mongoose";


let db = db_tools();
let menuModuleSchema = new mongoose.Schema({

    modulename: {
        type: String
    },

    url_value:{
        type:String
    },

    module_class_name:{
        type:String
    },

    created_on: {
        type: Date,
        default: Date.now
    }
})

const menuModule = mongoose.model('modules', menuModuleSchema);


const findNonPermittedModuleID = function() {
    return new Promise(function(resolve, reject) {
        menuModule.find({}, {
                _id: 1
            })
            .then(menumodelResponse => {
                resolve(menumodelResponse);
            }).catch(err => {
                reject(err);
            })
    })
}

const findDeniedModules = function() {
    return new Promise(function(resolve, reject) {
        menuModule.find({}, {
                _id: 1
            })
            .then(menumodelResponse => {
                resolve(menumodelResponse)
            }).catch(err => {
                reject(err);
            })
    })
}


const createModule = function(moduleData) {
    let menuModules = new menuModule(moduleData);
    return new Promise(function(resolve, reject) {
        menuModules.save()
            .then(dbresponse => {
                resolve(dbresponse)
            }).catch(err => {
                reject(err);
            })
    })
}

const getList = function() {
    return new Promise(function(resolve, reject) {
        menuModule.find({}, {
                modulename: 1,
                url_value:1
            })
            .then(dbresponse => {
                resolve(dbresponse)
            }).catch(err => {
                reject(err);
            })
    })
}


const findAllModule = function() {
    return new Promise(function(resolve, reject) {
        menuModule.find({}, {
                _id: 1,
                modulename:1
            })
            .then(dbresponse => {
                resolve(dbresponse)
            }).catch(err => {
                reject(err);
            })
    })
}

const transactionModuleData = function(elementData){
    return new Promise(function(resolve,reject){
        menuModule.find({url_value:elementData})
            .then(dbResponse =>{
                resolve(dbResponse)
            }).catch(err =>{
                reject(err);
            })
    })
}

const moduleFind = function(){
    return new Promise(function(resolve,reject){
        menuModule.find({})
            .then(dbResponse =>{
                resolve(dbResponse)
            }).catch(err =>{
                reject(err);
            })
    })
}


const findNonMenuElementModule = function() {
    return new Promise(function(resolve, reject) {
        menuModule.find({}, {
               // _id: 1,
                modulename:1,
                url_value:1,
                module_class_name:1
            })
            .then(dbresponse => {
                console.log("")
                resolve(dbresponse)
            }).catch(err => {
                reject(err);
            })
    })
}

export {
    createModule,
    getList,
    findNonPermittedModuleID,
    findDeniedModules,
    findAllModule,
    transactionModuleData,
    moduleFind,
    findNonMenuElementModule
}