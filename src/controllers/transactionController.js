import {
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
} from '../models/transactionModel'


let viewTransaction = (req, res, next)=> {
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size)
    let resObj;
    transactionDetails(pageNo,size)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "transaction Data found sucessfully",
                    data: response
                }
            };
            res.send(resObj);
        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let pendingDetails = (req, res, next)=> {
    let resObj;
    pendingTranaction()
        .then(pendingTransactionResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "transaction Data found sucessfully",
                    data: pendingTransactionResponse
                }
            };
            res.send(resObj);
        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let search = (req, res, next)=> {
    let transactionData = req.body;
    let resObj;
    searchFilter(transactionData)
        .then(filterResponse => {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        data: filterResponse
                    }
                };
                res.send(resObj);
        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let searchByPnr = (req, res, next)=> {
    let pnrData = req.body;
    let resObj;
    pnrSearch(pnrData)
        .then(pnrFilterResponse => {
            if (pnrFilterResponse[0].status_flag == true) {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            } else {
                resObj = {
                    status: true,
                    "response": {
                        "msg": false,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            }

        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let getSingleTransactionDetail = (req, res, next)=> {
    let reqData = req.body;
    let resObj;
    singleTranscation(reqData)
        .then(modelResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "Data found sucessfully",
                    data: modelResponse
                }
            };
            res.send(resObj);
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


let filterStatus = (req, res, next)=> {
    let reqData = req.body;
    let resObj;
    findStatus(reqData)
        .then(modelResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "Data found sucessfully",
                    data: modelResponse
                }
            };
            res.send(resObj);
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


let cancelledList = (req,res,next)=>{
    let resObj;
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size)
    findCancelTicket(pageNo,size)
        .then(response =>{
            resObj = {
                status: true,
                "response": {
                    "message": "Data found sucessfully",
                    data: response
                }
            };
            res.send(resObj);
        }).catch(err =>{
            console.log("err",err);
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let refundList = (req,res,next)=>{
    let resObj;
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size)
    findRefundList(pageNo,size)
        .then(response =>{
            resObj = {
                status: true,
                "response": {
                    "message": "Data found sucessfully",
                    data: response
                }
            };
            res.send(resObj);
        }).catch(err =>{
            console.log("err",err);
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let cancelledTicketSearchByPnr = (req,res,next)=>{
    let pnrData = req.body;
    let resObj;
    pnrSearch(pnrData)
        .then(pnrFilterResponse => {
            if (pnrFilterResponse[0].status_flag == true) {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            } else {
                resObj = {
                    status: true,
                    "response": {
                        "msg": false,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            }

        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
    
}

let cancelledTicketSearchByOption = (req,res,next)=>{
    let transactionData = req.body;
    let resObj;
    searchFilter(transactionData)
        .then(filterResponse => {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        data: filterResponse
                    }
                };
                res.send(resObj);
        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let refundViewSearchByPnr =(req,res,next)=>{
    let pnrData = req.body;
    let resObj;
    pnrSearch(pnrData)
        .then(pnrFilterResponse => {
            if (pnrFilterResponse[0].status_flag == true) {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            } else {
                resObj = {
                    status: true,
                    "response": {
                        "msg": false,
                        "data": pnrFilterResponse
                    }
                };
                res.send(resObj);
            }

        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let refundViewSearchByOption = (req,res,next)=>{
    let transactionData = req.body;
    let resObj;
    searchFilter(transactionData)
        .then(filterResponse => {
                resObj = {
                    status: true,
                    "response": {
                        "msg": true,
                        data: filterResponse
                    }
                };
                res.send(resObj);
        })
        .catch(err => {
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


/*let adminTicketCancellation = (req,res,next)=>{
    let ticketCancelData = req.body;
    let resObj;
    ticketCancel(ticketCancelData)
        .then(response =>{
            resObj = {
                status: true,
                "response": {
                    "message": "Ticket Cancelled sucessfully",
                    Data:response
                }
            };
            res.send(resObj);
        }).catch(err =>{
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}*/




let toCancel = (req,res,next)=>{
let cancelData = req.body;
let resObj;
toCancelStatus(cancelData)
    .then(response =>{
        console.log("response",response)
        resObj = {
            status: true,
            "response": {
                "message": "Ticket is in cancel state",
            }
        };
        res.send(resObj);
    }).catch(err =>{
        console.log("err",err);
        resObj = {
            status: false,
            "response": {
                "message": err
            }
        };
        res.status(400).send(resObj);
    })
}



let toRefund = (req,res,next)=>{
    let refundData = req.body;
    let resObj;
    toRefundStatus(refundData)
        .then(response =>{
            console.log("response",response)
            resObj = {
                status: true,
                "response": {
                    "message": "Ticket is in refund state",
                }
            };
            res.send(resObj);
        }).catch(err =>{
            console.log("response",err)
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}


let cancelationStatus = (req,res,next)=>{
    let canceledData = req.body;
    let resObj;
    canceledstate(canceledData)
        .then(response =>{
            console.log("response",response)
            resObj = {
                status: true,
                "response": {
                    "message": "refund amount is in user wallet",
                }
            };
            res.send(resObj);
        }).catch(err =>{
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

export {
    viewTransaction,
    pendingDetails,
    search,
    searchByPnr,
    getSingleTransactionDetail,
    filterStatus,
    cancelledList,
    cancelledTicketSearchByPnr,
    cancelledTicketSearchByOption,
    refundList,
    refundViewSearchByPnr,
    refundViewSearchByOption,
    //adminTicketCancellation,
    toCancel,
    toRefund,
    cancelationStatus
};