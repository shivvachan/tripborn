import {createProvider,
    listProvider,
    updateProvider
} from  "../models/providerModel";

import {findGlobalBnFee} from "../models/globalSettingModel"


let providerCreation = (req,res,next) =>{
    let providerData =  req.body;
    let resObj;
    createProvider(providerData)
        .then(providerResponse =>{
            resObj = {
                status: true,
                "response": {
                    "message": "Data Found Successfully",
                    "Data": providerResponse
                }
            };
            res.send(resObj)
        }).catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let providerList = (req, res, next) => {
    let resObj;
    listProvider()
        .then(response => {
            let formattedArr = [];
            findGlobalBnFee()
                .then(gdsResponse => {
                    response.map(providerResponse => {
                        if ("bnfee" in providerResponse) {
                            const formattedData = {
                                _id: providerResponse._id,
                                providerName: providerResponse.providename,
                                email: providerResponse.email,
                                status: providerResponse.status,
                                bn_fee: providerResponse.bnFee,
                                providerDescription: providerResponse.providerDesc,
                                created_on: providerResponse.created_on
                            }
                            formattedArr.push(formattedData);
                        } else {
                            const formattedData = {
                                _id: providerResponse._id,
                                providerName: providerResponse.providename,
                                email: providerResponse.email,
                                status: providerResponse.status,
                                bn_fee: gdsResponse.bnFee,
                                providerDescription: providerResponse.providerDesc,
                                created_on: providerResponse.created_on
                            }
                            formattedArr.push(formattedData);
                        }
                        resObj = {
                            status: true,
                            "response": "Provider data found succesfully",
                            "Data": formattedArr
                        }
                    })
                    res.send(resObj);
                })
        }).catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let providerUpdation =  (req,res,next)=>{
    let providerUpdateData = req.body;
    let resObj;
    updateProvider()
        .then(updatedData =>{
            resObj = {
                status : true,
                "response":"Provider data uploaded sucessfully",
            }
        }).catch(err =>{
            resObj = {
                status : false,
                "response":{
                    "message" : err
                }
            }
        })
}

export {
    providerCreation,
    providerList,
    providerUpdation
}