import db_tools from "../tools/db_tools";
import mongoose from "mongoose";


let db = db_tools();
let groupMenuSchema = new mongoose.Schema({

    display_name:{type:String},

    group_menu_url :  {type: Array},

    position:{type:Number},

    created_on: {
        type: Date,
        default: Date.now
    }
})

const groupMenuModule = mongoose.model('menugroups', groupMenuSchema);

const createMenu = (userData) => {
    let groupMenuModuleObject = new groupMenuModule(userData);
    return new Promise((resolve,reject) =>{
        groupMenuModuleObject.save()
            .then(dbResponse =>{
                resolve(dbResponse)
            }).catch(err =>{
                reject(err);
            })
    })
}

const menuGroup = function(){
    return new Promise(function(resolve,reject){
        groupMenuModule.find({})
            .then(groupMenuResponse =>{
                resolve(groupMenuResponse)
            }).catch(err =>{
                reject(err)
            })
    })
}




export {
    createMenu,
    menuGroup
};