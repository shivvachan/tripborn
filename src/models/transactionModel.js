import db_tools from "../tools/db_tools";
import mongoose from "mongoose";

var Int32 = require('mongoose-int32');
import Double from '@mongoosejs/double';

let db = db_tools();

let transactionSchema = new mongoose.Schema({

    "holdDetails": {
        "stubId": {
            type: String
        },
        "pickupCode": {
            type: String
        },
        "dropoffCode": {
            type: String
        },
        "contactInfo": {
            "customerName": {
                type: String
            },
            "email": {
                type: String
            },
            "mobile": {
                type: String
            },
            "wallet": {
                "walletChecked": {
                    type: Boolean
                },
                "walletBalance": {
                    type: Int32
                },
            },
            "userIP": {
                type: String
            },
            "userOS": {
                type: String
            },
        },
        "passengersObj": [{
            "name": {
                type: String
            },
            "gender": {
                type: String
            },
            "age": {
                type: Int32
            },
            "seatNo": {
                type: String
            },
            "fare": {
                type: Int32
            },
            "seatTypeId": {
                type: Int32
            },
            "isAC": {
                type: Boolean
            },
        }],
        "orderId": {
            type: String
        },
    },
    "authenticUser": {
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
                type: Double
            },
        }
    },
    "transactionDetails": {
        "transactionId": {
            type: String
        },
        "transaction_status_flag": {
            type: Boolean
        },
        "order_id": {
            type: String
        },
        "tracking_id": {
            type: String
        },
        "bank_ref_no": {
            type: String
        },
        "order_status": {
            type: String
        },
        "failure_message": {
            type: String
        },
        "payment_mode": {
            type: String
        },
        "card_name": {
            type: String
        },
        "status_code": {
            type: String
        },
        "status_message": {
            type: String
        },
        "currency": {
            type: String
        },
        "amount": {
            type: String
        },
        "billing_name": {
            type: String
        },
        "billing_address": {
            type: String
        },
        "billing_city": {
            type: String
        },
        "billing_state": {
            type: String
        },
        "billing_zip": {
            type: String
        },
        "billing_country": {
            type: String
        },
        "billing_tel": {
            type: String
        },
        "billing_email": {
            type: String
        },
        "delivery_name": {
            type: String
        },
        "delivery_address": {
            type: String
        },
        "delivery_city": {
            type: String
        },
        "delivery_state": {
            type: String
        },
        "delivery_zip": {
            type: String
        },
        "delivery_country": {
            type: String
        },
        "delivery_tel": {
            type: String
        },
        "merchant_param1": {
            type: String
        },
        "merchant_param2": {
            type: String
        },
        "merchant_param3": {
            type: String
        },
        "merchant_param4": {
            type: String
        },
        "merchant_param5": {
            type: String
        },
        "vault": {
            type: String
        },
        "offer_type": {
            type: String
        },
        "offer_code": {
            type: String
        },
        "discount_value": {
            type: String
        },
        "mer_amount": {
            type: String
        },
        "eci_value": {
            type: String
        },
        "retry": {
            type: String
        },
        "response_code": {
            type: String
        },
        "billing_notes": {
            type: String
        },
        "trans_date": {
            type: String
        },
        "bin_country": {
            type: String
        },
    },
    "status_flag": {
        type: Boolean
    },
    "order_status": {
        type: String
    },
    "isData": {
        type: String
    },
    "createdAt": {
        type: Date
    },
    "bookingDetails": {
        "isCancelled": {
            type: Boolean
        },
        "busTypeName": {
            type: String
        },
        "departureDateTime": {
            type: String
        },
        "arrivalDateTime": {
            type: String
        },
        "journeyDate": {
            type: String
        },
        "toCityName": {
            type: String
        },
        "fromCityName": {
            type: String
        },
        "companyName": {
            type: String
        },
        "cancellationTerms": [{
                type: String
            },
            {
                type: String
            },
            {
                type: String
            },
        ],

        /*ratings: [ { 
            by: "ijk", 
            rating: 4 
        } ],*/

        "cancellation" : [{
            "status" : { type: String},

            "toCancelRemarks" : {type:String},

            "cancellation_date": {
                type: Date,
                default: Date.now
            },
            
            "toRefundRemarks" : {type:String},

            "cancelRemarks": {type: String},

            "cancelStatus": {type:String},

            "refundAmount": {type:String},

            "updated_wallet": {type:String}
        }],

        "passengers": [{
            "name": {
                type: String
            },
            "age": {
                type: Int32
            },
            "gender": {
                type: String
            },
            "seatNo": {
                type: String
            },
            "fare": {
                type: Int32
            },
            "seatTypeId": {
                type: String
            },
            "isAC": {
                type: Boolean
            },
        }],
        "contactInfo": {
            "name": {
                type: String
            },
            "email": {
                type: String
            },
            "mobile": {
                type: String
            },
            "bnPointsReedem": {
                type: Boolean
            },
        },
        "pickupInfo": {
            "pickupTime": {
                type: String
            },
            "pickupName": {
                type: String
            },
            "address": {
                type: String
            },
            "contact": {
                type: String
            },
            "landmark": {
                type: String
            },
        },
        "holdId": {
            type: Int32
        },
        "orderId": {
            type: String
        },
        "BusNext_PNR": {
            type: String
        },
        "PNR": {
            type: String
        },
        "ticketNo": {
            type: String
        }
    }
})

const transactions = mongoose.model('transaction', transactionSchema);

const transactionDetails = function(pageNo, size) {
    return new Promise(function(resolve, reject) {
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
        let filter = {}
        //filter.status = true

        transactions.countDocuments({})
            .then(totalUserCount => {
                if (!totalUserCount) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    }
                }
                transactions.find({}, {}, query)
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

const pendingTranaction = function() {
    return new Promise(function(resolve, reject) {
        transactions.find({
                status_flag: false
            })
            .then(dbResponse => {
                resolve(dbResponse);
            })
            .catch(err => {
                resolve(err);
            })
    })
}



const searchFilter = function(transactionData) {
    return new Promise(function(resolve, reject) {
        let filter = {};
        let fromDate = "";
        let toDate = "";
        if (transactionData.fromdate && transactionData.todate) {
            if (transactionData.fromdate) {
                let date = transactionData.fromdate;
                let dateSplit = date.split("-");
                fromDate = new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1] - 1), parseInt(dateSplit[0]));
            }
            if (transactionData.todate) {
                let date = transactionData.todate;
                let dateSplit = date.split("-");
                toDate = new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1] - 1), parseInt(dateSplit[0]));
                toDate.setDate(toDate.getDate() + 1);
            }
            filter["$and"] = [{
                "createdAt": {
                    "$gte": fromDate
                }
            }, {
                "createdAt": {
                    "$lte": toDate
                }
            }];
        } else if (transactionData.fromdate) {
            let date = transactionData.fromdate;
            let dateSplit = date.split("-");
            fromDate = new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1] - 1), parseInt(dateSplit[0]));
            var todayDate = new Date();
            var formatedDate = todayDate.toISOString();
            filter["$and"] = [{
                "createdAt": {
                    "$gte": fromDate
                }
            }, {
                "createdAt": {
                    "$lte": formatedDate
                }
            }];
        }
        if (transactionData.busNextPnr !== "") {
            filter["bookingDetails.BusNext_PNR"] = transactionData.busNextPnr
        }
        if (transactionData.email !== "") {
            filter["holdDetails.contactInfo.email"] = transactionData.email
        }
        if (transactionData.mobile !== "") {
            filter["holdDetails.contactInfo.mobile"] = transactionData.mobile
        }
        if (transactionData.crsPnr !== "") {
            filter["bookingDetails.PNR"] = transactionData.crsPnr
        }
        if (transactionData.orderStatus !== "") {
            filter["order_status"] = transactionData.orderStatus
        }
        transactions.find({
            $and: [filter]
        }).then(dbResponse => {
            if (dbResponse.length > 0) {
                resolve(dbResponse);
            } else {
                //let resultResponse = "Invalid Input!!! Data Not Found"
                resolve([]);
            }
        }).catch(err => {
            reject(err);
        })

    })
}


const pnrSearch = function(pnrData) {
    return new Promise(function(resolve, reject) {
        transactions.find({
                "bookingDetails.BusNext_PNR": pnrData.busNextPnr
            })
            .then(pnrDbResponse => {
                if (pnrDbResponse.length > 0) {
                    resolve(pnrDbResponse)
                } else {
                    resolve("PNR Not found")
                }

            }).catch(err => {
                reject(err);
            })
    })
}

const singleTranscation = function(reqData) {
    return new Promise(function(resolve, reject) {
        if (Object.keys(reqData).length > 0) {
            var filter = {}
            filter._id = reqData.id;
            transactions.find(filter)
                .then(dbResponse => {
                    resolve(dbResponse)
                }).catch(err => {
                    reject(err);
                })
        } else {
            reject("req is not valid");
        }
    })
}

const findStatus = function(reqData) {
    return new Promise(function(resolve, reject) {
        transactions.find({
                order_status: reqData.orderStatus
            })
            .then(dbResponse => {
                resolve(dbResponse);
            }).catch(err => {
                reject(err);
            })
    })
}

const findCancelTicket = (pageNo,size) => {
    return new Promise((resolve, reject) => {
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
        //let filter = {}
        //filter.bookingDetails.cancellation = "ToCancel"
        transactions.countDocuments({})
            .then(totalUserCount => {
                if (!totalUserCount) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    }
                }
                transactions.find({"bookingDetails.cancellation":{ $elemMatch:{ status: "toCancel"}}}, {}, query)
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


const findRefundList = (pageNo,size) => {
    return new Promise((resolve, reject) => {
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
        let filter = {}
        filter.order_status = "ToRefund"
        transactions.countDocuments({})
            .then(totalUserCount => {
                if (!totalUserCount) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    }
                }
                transactions.find({"bookingDetails.cancellation":{ $elemMatch:{ status: "toRefund"}}}, {}, query)
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

/*let ticketCancel = (ticketCancelData)=>{

    console.log("ticketCancelData",ticketCancelData)
    return new Promise((resolve,reject)=>{
        /*transactions.findOne({
            "holdDetails.orderId":ticketCancelData.orderId,
            "holdDetails.stubId":ticketCancelData.stubId
        })*/
        /*.then(dbResponse =>{

            console.log("")
                   if(dbResponse) {
                        console.log("stubId",dbResponse.holdDetails.stubId);
                        console.log("orderId",dbResponse.holdDetails.orderId);
                        /*const obj = {
                            orderId : dbResponse.holdDetails.orderId,
                            stubId :  dbResponse.holdDetails.stubId   
                        }*/
                        /*const formData = {
                            orderId : ticketCancelData.orderId,
                            stubId :  ticketCancelData.stubId   
                         };
                        console.log("formData",formData);
                    const request = require('request');
                    request.post({
                          url: 'http://192.168.2.98:8000/agds/cancel-seats',
                          form: formData
                        },
                        function (err, httpResponse, body) {
                            if(err){
                                reject(err);
                            }else {
                                console.log("err",err);
                                console.log("body",body);
                            }
                        });
                   //}
                //resolve(dbResponse)
            }).catch(err =>{
                reject(err)
            })
    })
}*/

let toCancelStatus = (ticketCancelData) => {
    return new Promise((resolve, reject) => {
        transactions.findOne({
            _id: ticketCancelData.transactionid,
            //"bookingDetails.orderId": ticketCancelData.orderId
        }).then(findresponse => {
            console.log("findresponse",findresponse.bookingDetails.passengers)
            let cancel = [];
            cancel.push({
                status: 'toCancel',
                toCancelRemarks: ticketCancelData.toCancelRemark,
                toRefundRemarks: "",
                cancelRemarks: "",
                cancelStatus: "",
                refundAmount: ""
            });
            findresponse.bookingDetails.cancellation = cancel;
            transactions.updateOne({
                    "bookingDetails.orderId": findresponse.bookingDetails.orderId
                }, {
                    $set: {
                        "bookingDetails.cancellation": cancel
                    }
                })
                .then(updatedresponse => {
                    resolve(updatedresponse)
                }).catch(err => {
                    reject(err);
                })
        }).catch(err => {
            reject(err);
        })
    })
}

let toRefundStatus = (refundData) => {
    return new Promise((resolve, reject) => {
        transactions.findOne({
            _id: refundData.transactionid
           // "bookingDetails.orderId": refundData.orderId
        }).then(findresponse => {
            //console.log("findresponse",findresponse.bookingDetails.cancelation);
            findresponse.bookingDetails.cancellation.map(result =>{
                let refund = [];
            refund.push({
                status: 'toRefund',
                toCancelRemarks :result.toCancelRemarks,
                toRefundRemarks: refundData.toRefundRemark,
                cancelRemarks: "",
                cancelStatus: "",
                refundAmount: ""
            });
            findresponse.bookingDetails.cancellation = refund;
            transactions.updateOne({
                    "bookingDetails.orderId": findresponse.bookingDetails.orderId
                }, {
                    $set: {
                        "bookingDetails.cancellation": refund
                    }
                })
                .then(updatedresponse => {
                    resolve(updatedresponse)
                }).catch(err => {
                    reject(err);
                })
            })
        }).catch(err => {
            reject(err);
        })
    })
}


let canceledstate = (canceledData) => {
    return new Promise((resolve, reject) => {
        transactions.findOne({
            _id: canceledData.transactionid,
            //"bookingDetails.orderId": canceledData.orderId
        }).then(findresponse => {
            console.log("Refund amount-------->>",typeof(canceledData.amountRefund))
            let current_wallet = findresponse.authenticUser.wallet;
            console.log("Current wallet--->", current_wallet)
            findresponse.bookingDetails.cancellation.map(result =>{
            let cancel = [];
            cancel.push({
                status: 'CANCELLED',
                toCancelRemarks: result.toCancelRemarks,
                toRefundRemarks: result.toRefundRemarks,
                cancelRemarks: canceledData.cancelRemark,
                refundAmount: canceledData.amountRefund,
                updated_wallet: current_wallet + canceledData.amountRefund
            });
            findresponse.bookingDetails.cancellation = cancel;
            transactions.updateOne({
                    "bookingDetails.orderId": findresponse.bookingDetails.orderId
                }, {
                    $set: {
                        "bookingDetails.cancellation": cancel
                    }
                })
                .then(updatedresponse => {
                    resolve(updatedresponse)
                }).catch(err => {
                    reject(err);
                })
            })
        }).catch(err => {
            reject(err);
        })
    })
}

export {
    transactions,
    transactionDetails,
    pendingTranaction,
    searchFilter,
    pnrSearch,
    singleTranscation,
    findStatus,
    findCancelTicket,
    findRefundList,
    //ticketCancel,
    toCancelStatus,
    toRefundStatus,
    canceledstate
};