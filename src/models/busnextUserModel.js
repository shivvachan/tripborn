import db_tools from "../tools/db_tools";
import mongoose from "mongoose";

var Int32 = require('mongoose-int32');
import Double from '@mongoosejs/double';

let db = db_tools();

let busnextUserSchema = new mongoose.Schema({

    "phone": {
        type: String
    },
    "email": {
        type: String
    },
    "name": {
        type: String
    },
    "gender": {
        type: String
    },
    "role": {
        type: String
    },
    "wallet": {
        type: Int32
    },

    "userBadgeValue": {
        type: Int32
    },
    "userBadge": {
        "badgeName": {
            type: String
        },
        "badgeValue": {
            type: Int32
        }
    },
    "coupons": {
        "couponCode": {
            type: String
        },
        "couponVal": {
            type: String
        },
        "couponValidity": {
            type: String
        }
    },
    "tempToken": {
        type: String
    },
    "createdAt": {
        type: String
    },
    "status_flag": {
        type: Boolean
    }
})

const busnextUser = mongoose.model('users', busnextUserSchema);


const BusNextUserList = function(pageNo , size){
    return new Promise(function(resolve , reject){

        let query = {}
        let response;
        let totalPages
        if (pageNo < 0 || pageNo === 0) {
            response = {
                "error": true,
                "message": "invalid page number, should start with 1"
            };
            reject(response)
        }
        query.skip = size * (pageNo - 1)
        query.limit = size
       
        busnextUser.count({})
            .then(totalUserCount => {
                if (!totalUserCount) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    }
                }
                busnextUser.find({},{},query)
                    .then(filteredData => {
                        if (!filteredData) {
                            response = {
                                "error": true,
                                "message": "Error fetching data"
                            };
                        } else {
                            totalPages = Math.ceil(totalUserCount / size)
                        }
                        response = {
                            "status": true,
                            "data": filteredData,
                            "pages": totalPages
                        };
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err);
                    })

            })
    })
}

const searchBusNext = function(searchData){
    return new Promise(function(resolve,reject){
        let filter = {};
        if (searchData.phone !== "") {
            filter["phone"] = searchData.phone
        }
        if (searchData.email !== "") {
            filter["email"] = searchData.email
        }
        if (searchData.name !== "") {
            filter["name"] = searchData.name
        }
        console.log("filter",filter);
        //filter.status = true;
        busnextUser.find({
            $and: [filter]
        }).then(dbResponse => {
            if (dbResponse.length > 0) {
                resolve(dbResponse);
            } else {
                resolve(["Invalid Input!!! Data Not Found"]);
            }
        }).catch(err => {
            reject(err);
        })
    })
}



export {
    BusNextUserList,
    searchBusNext
}