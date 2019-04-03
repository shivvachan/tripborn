import db_tools from "../tools/db_tools";
import mongoose from "mongoose";

let db = db_tools();

let UserRoleSchema = new mongoose.Schema({
    user_role: {
        type: String
    },

    permitted_module: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'modules'
    }],

    created_on: {
        type: Date,
        default: Date.now
    }
})

const userRoles = mongoose.model('userroles', UserRoleSchema)



const userrole_validation = (userData) => {
    return new Promise((resolve, reject) => {
        userRoles.findOne({
                $text: {
                    $search: userData.user_role,
                    $caseSensitive: false
                }
            })
            .then(userroledb => {
                resolve(userroledb)
            }).catch(err => {
                reject(err);
            })
    })
}

const createUserRole = function(userData) {
    let userrole = new userRoles(userData);
    return new Promise(function(resolve, reject) {
        userrole.save()
            .then(userRoleData => {

                resolve(userRoleData)
            })
            .catch(err => {
                reject(err);
            })
    })
}

let updateUserRole = (userUpdateData)=>{ 
    return new Promise((resolve,reject)=>{
        userRoles. updateOne({ _id: userUpdateData.userRoleId},
            { $pull:
                { 
                'permitted_module': userUpdateData.permittedModuleId
                }
            })
            .then(updatedResponse =>{
                resolve(updatedResponse)
            }).catch(err =>{
                reject(err);
            })
        })

}
        


const roleList = function() {
    return new Promise(function(resolve, reject) {
        userRoles.find({}, {
                user_role: -1
            })
            .then(userRoleList => {
                resolve(userRoleList)
            })
            .catch(err => {
                reject(err);
            })
    })
}


const userRoleList = function(data) {
    return new Promise(function(resolve, reject) {
        var filter = {};
        if (data.user_role_id) {
            filter._id = data.user_role_id;
        }
        userRoles.find(filter, {
                user_role: 1,
                permitted_module: 1
            })
            .then(userDetails => {
                resolve(userDetails);
            })
            .catch(err => {
                reject(err);
            })

    })
}

const findModule = function(roleID) {

    console.log("adminData",roleID);
    return new Promise(function(resolve, reject) {
        userRoles.findOne({
                _id: roleID
            }, {
                permitted_module: 1,
            }).populate('permitted_module', {
                url_value:1,
                modulename: 1,
                module_class_name:1,
                _id: 1
            })
            .then(userPermittedModuleID => {
                resolve(userPermittedModuleID)
            }).catch(err => {
                reject(err);
            })
    })
}

const moduleAssigned = function() {
    return new Promise(function(resolve, reject) {
        userRoles.find({}, {
                user_role: 1
            })
            .populate('permitted_module', {
                modulename: 1,
                _id: 1
            })
            
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

const excludepermittedModule = function(roleid){
    return new Promise(function(resolve,reject){
        userRoles.find({
            _id: roleid.user_role_id
        }, {
            permitted_module: 1,
        })
        .populate('permitted_module', {
                modulename: 1,
                _id: 0
            })
        .then(userPermittedModuleID => {
            resolve(userPermittedModuleID)
        }).catch(err => {
            reject(err);
        })
    })
}

const findPermittedID = function(roleID) {
    return new Promise(function(resolve, reject) {
        userRoles.find({
            _id: roleID.user_role_id
        }, {
            permitted_module: 1,
        }).populate('permitted_module', {
            modulename: 1,
            _id: 1
        })
        .then(userPermittedModuleID => {
            resolve(userPermittedModuleID)
        }).catch(err => {
            reject(err);
        })
    })
}



export {
    userRoles,
    createUserRole,
    updateUserRole,
    roleList,
    userRoleList,
    moduleAssigned,
    userrole_validation,
    excludepermittedModule,
    findPermittedID,
    findModule
};