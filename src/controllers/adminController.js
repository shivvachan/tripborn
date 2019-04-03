import {sendAdminMessage} from '../models/adminModel';

let adminMessage = (req,res,next)=>{
    let adminData = req.body;
    let resObj;

    sendAdminMessage(adminData)
        .then(adminDbResponse =>{
            resObj ={
                "message":"succesfully sent"
            }
           res.send(resObj); 
        }).catch(err =>{
            resObj :{
                msg :err
            }
            res.status(400).send(resObj);
        })
}



export {
    adminMessage
}