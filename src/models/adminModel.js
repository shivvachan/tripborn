import db_tools from "../tools/db_tools";
import mongoose from "mongoose";


let db = db_tools();
let adminMessageSchema = new mongoose.Schema({

    userIP:{type:String},

    firebaseToken : {type:String},

    created_on: {
        type: Date,
        default: Date.now
    }
})

const adminMessageModule = mongoose.model('messages', adminMessageSchema);


const sendAdminMessage = (adminMessage)=> {
    let adminMessageModuleObject = new adminMessageModule(adminMessage);
    return new Promise((resolve, reject)=> {
        adminMessageModule.findOne({
                userIP: adminMessage.userIP
            })
            .then(adminData => {
                console.log("adminData",adminData);
                if (adminData.userIP == adminMessage.userIP) {
                    console.log("entred");
                    adminMessageModule.updateOne({
                        userIP: adminMessage.userIP
                    }, {
                        $set: {
                            firebaseToken: adminMessage.firebaseToken
                        }
                    }).then(updatedMessage =>{
                        resolve(updatedMessage)
                    }).catch(err =>{
                        reject(err);
                    })
                } else {
                    adminMessageModuleObject.save()
                        .then(dbResponse => {
                            resolve(dbResponse)
                        }).catch(err => {
                            reject(err);
                        })
                }
            })
    })
}

export {
    sendAdminMessage
}