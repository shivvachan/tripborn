import db_tools from "../tools/db_tools";
import mongoose from "mongoose";
import redis from "redis";
import bluebird from "bluebird";
import {
    positive_messages,
    negative_messages,
    user_role,
    sms_details,
    email_details
} from "../utils/strings";
import nodemailer from "nodemailer";

import menumodule from "../models/menuModuleModel";

import userRole from "../models/userRoleModel";

//var bcrypt = require('bcrypt');

import bcrypt from 'bcryptjs';

var BCRYPT_SALT_ROUNDS = 12;


// database connect
let db = db_tools();


let adminUserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },

    user_email: {
        type: String,
        required: true
    },

    user_mobile: {
        type: String,
        required: true
    },

    user_role: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    user_role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_types',
        required: true
    },

    include_module: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'modules'
    }],

    exclude_module: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'modules'

    }],

    created_on: {
        type: Date,
        default: Date.now
    },

    status: {
        type: Boolean,
        default: true
    },
})

let adminUser = mongoose.model('adminuser', adminUserSchema);


let findPermittedModule = (userData) => {
    return new Promise((resolve, reject) => {
        userRoles.find({
                _id: userData.id
            })
            .populate('allowed_Module', {
                modulename: 1,
                _id: 0
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

let validateUser = (userid) => {
    return new Promise((resolve, reject) => {
        let dbUserObj = {
            _id: userid
        }
        adminUser.findOne(dbUserObj)
            .then(authUserData => {
                resolve(authUserData);
            })
            .catch(err => {
                reject(err);
            })

    })
}


let mobileValidation = (userData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_mobile: userData.user_mobile,
                status: true
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

let emailValidation = (userData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_email: userData.user_email,
                status: true
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

let mobileCheck = (loginData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_mobile: loginData.user_mobile
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

let passwordCheck = (loginData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_mobile: loginData.user_mobile
            })
            .then(adminUserData => {
                bcrypt.compare(loginData.password, adminUserData.password, (err, res) => {
                    if (res == false) {
                        adminUser.findOne({
                                password: loginData.password
                            })
                            .then(loggedinData => {
                                resolve(loggedinData)
                            }).catch(err => {
                                reject(err);
                            })
                    }
                    if (res == true) {
                        adminUser.findOne({
                                password: adminUserData.password
                            })
                            .then(logedinData => {
                                resolve(logedinData);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    }
                })

            }).catch(err => {
                reject(err);
            })
    })
}


/*Admin user Creation */
let userAdmin = function(adminData) {
    let adminusers = new adminUser(adminData);
    return new Promise(function(resolve, reject) {
        bcrypt.hash(adminusers.password, BCRYPT_SALT_ROUNDS)
            .then(hashedPassword => {
                adminusers.password = hashedPassword
                adminusers.save()
                    .then(adminuserData => {
                        resolve(adminuserData)
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
    })
}

/*filter Admin user based on Role*/
let filterUserAdmin = function(adminUserData, pageNo, size) {
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
        filter.status = true

        adminUser.countDocuments({})
            .then(totalUserCount => {
                if (!totalUserCount) {
                    response = {
                        "error": true,
                        "message": "Error fetching data"
                    }
                }
                adminUser.find(filter, {}, query)
                    .populate('include_module', {
                        modulename: 1,
                        _id: 1,
                    })
                    .populate('exclude_module', {
                        modulename: 1,
                        _id: 1
                    })
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

let adminSearch = function(searchData) {
    return new Promise(function(resolve, reject) {
        let filter = {};
        let fromDate = "";
        let toDate = "";
        if (searchData.user_mobile !== "") {
            filter["user_mobile"] = searchData.user_mobile
        }
        if (searchData.user_email !== "") {
            filter["user_email"] = searchData.user_email
        }
        if (searchData.user_name !== "") {
            filter["user_name"] = searchData.user_name
        }
        filter.status = true;

        console.log("filter", filter)
        adminUser.find({
            $and: [filter]
        }).then(dbResponse => {
            console.log("dbResponse", dbResponse);
            if (dbResponse.length > 0) {
                resolve(dbResponse);
            } else {
                resolve([]);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let userRoleSearch = function(roleidData) {
    return new Promise(function(resolve, reject) {
        adminUser.find({
                user_role_id: roleidData.userroleid,
                status:true
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err)
            })
    })
}

let updateAdminUser = function(updateReq) {
    return new Promise((resolve, reject) => {
        adminUser.updateOne({
            _id: updateReq.id
        }, {
            $set: {
                include_module: updateReq.include_module,
                exclude_module: updateReq.exclude_module,
                user_name: updateReq.user_name,
                user_email: updateReq.user_email,
                user_mobile: updateReq.user_mobile,
                user_role: updateReq.user_role,
                user_role_id: updateReq.user_role_id
            }
        }).then(updatedUser => {
            resolve(updatedUser);
        }).catch(err => {
            reject(err);
        });
    }).catch(err => {
        reject(err)
    })
    //})       
}

/*soft delete */
let deleteUser = function(reqData) {
    return new Promise(function(resolve, reject) {
        var filter = {}
        adminUser.findByIdAndUpdate({
                _id: reqData.id
            }, {
                $set: {
                    status: false
                }
            })
            .then(dbResponse => {
                resolve(dbResponse)
            }).catch(err => {
                reject(err);
            })
    })
}


let adminLogin = function(loginData) {
    return new Promise(function(resolve, reject) {
        if (!loginData.user_mobile || !loginData.password) {
            reject('Fields missing');
            return;
        }
        adminUser.findOne({
                user_mobile: loginData.user_mobile,
                status:true
            })
            .then(adminUserData => {
                bcrypt.compare(loginData.password, adminUserData.password, (err, res) => {
                    if (res) {
                        adminUser.find({
                                user_mobile: loginData.user_mobile,
                                password: adminUserData.password,
                                status: true
                            }, {
                                user_role: 1
                            })
                            .then(logedinData => {
                                resolve(logedinData);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    }
                })
            }).catch(err => {
                reject(err);
            })
    })
} 



let updateResetPassword = (resetPasswordData) => {
    console.log("resetPasswordData", resetPasswordData);
    return new Promise((resolve, reject) => {
        //return new Promise(function(resolve,reject){
        bcrypt.hash(resetPasswordData.cnfPwd, BCRYPT_SALT_ROUNDS)
            .then(hashedPassword => {
                resetPasswordData.cnfPwd = hashedPassword
                adminUser.updateOne({
                    user_mobile: resetPasswordData.user_mobile
                }, {
                    $set: {
                        password: resetPasswordData.cnfPwd
                    }
                }).then(updatedPassword => {
                    resolve(updatedPassword)
                }).catch(err => {
                    reject(err);
                })
            })
    })
}

let otpAdminLogin = (loginData, passcode, userMobile) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                _id: loginData.userid
            })
            .then(adminUserData => {
                adminUser.findOne({
                        user_mobile: userMobile,
                        password: passcode,
                        status: true
                    }, {
                        user_role: 1
                    })
                    .then(logedinData => {
                        resolve(logedinData);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }).catch(err => {
                reject(err);
            })
    })
}

let genreateOTP = (otpData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_mobile: otpData.user_mobile,
            })
            .then(userValidationData => {
                console.log("userValidationData", userValidationData);
                //if (userValidationData.length > 0) {
                let user_mobile = userValidationData.user_mobile;
                const request = require('request');
                let otp = Math.floor(100000 + Math.random() * 900000);
                request.get(sms_details.SMS_API_URL + "?user=" + sms_details.SMS_USER_ID + "&pass=" +
                    sms_details.SMS_USER_PASSWORD + "&sender=" + sms_details.SMS_SENDER + "&phone=" +
                    user_mobile + "&text=Your OTP is " + otp + " .This OTP expires in five minutes.&priority=ndnd",
                    function(error, response, body) {
                        if (error) {
                            reject(error)
                        } else {
                            bluebird.promisifyAll(redis.RedisClient.prototype);
                            bluebird.promisifyAll(redis.Multi.prototype);
                            const client = redis.createClient(); // create client with defaults
                            client.on("error", err => {
                                console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
                                process.exit(1);
                            });
                            let result = client.existsAsync(user_mobile)
                            let cachedOTP;
                            if (result) {
                                cachedOTP = client.setAsync(user_mobile, otp);
                                client.expire(user_mobile, 60)
                            }
                        }
                    })
                // create reusable transporter object using the default SMTP transport
                const transporter = nodemailer.createTransport({
                    host: "mail.tripborn.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    ignoreTLS: true,
                    authMethod: "PLAIN",
                    auth: {
                        user: 'relay7@takniki.com',
                        pass: 'Takniki@Relay07'
                    }
                });
                // setup email data with unicode symbols
                const mailOptions = {
                    from: `${'BusNext' + " <" + 'bus@busnext.com' + ">"}`, // sender address
                    to: userValidationData.user_email, // list of receivers
                    subject: 'BUSNEXT CREDENTIAL', // Subject line
                    html: 'Hi ' + userValidationData.user_name + ', ' + 'your Busnext OTP is : ' +
                        otp + ',' + " .This OTP expires in five minutes." // html body
                };
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                    // Preview only available when sending through an Ethereal account
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                });
                resolve(userValidationData);
            })
    })
}


let otpValidation = async (validateOtpData) => {
    //try {
    return new Promise((resolve, reject) => {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype);
        const client = redis.createClient(); // create client with defaults
        client.on("error", err => {
            console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
            process.exit(1);
        });
        client.existsAsync(validateOtpData.phone)
            .then(redisReply => {
                if (redisReply === 1) {
                    client.getAsync(validateOtpData.phone)
                        .then(redisOTP => {
                            resolve(redisOTP)
                        }).catch(err => {
                            reject(err);
                        })
                }
                if(redisReply === 0){
                    client.getAsync(validateOtpData.phone)
                    .then(redisOTP => {
                        resolve(redisOTP)
                    }).catch(err => {
                        reject(err);
                    })
                }
            })
    })
}


let resendOTP = (otpData) => {
    return new Promise((resolve, reject) => {
        let user_mobile = otpData.user_mobile;
            const request = require('request');
            let otp = Math.floor(100000 + Math.random() * 900000);
        request.get(sms_details.SMS_API_URL + "?user=" + sms_details.SMS_USER_ID + "&pass=" +
            sms_details.SMS_USER_PASSWORD + "&sender=" + sms_details.SMS_SENDER + "&phone=" +
            user_mobile + "&text=Your OTP is " + otp + " .This OTP expires in five minutes.&priority=ndnd",
            function(error, response, body) {
                if (error) {
                    reject(error)
                } else {
                    bluebird.promisifyAll(redis.RedisClient.prototype);
                    bluebird.promisifyAll(redis.Multi.prototype);

                    const client = redis.createClient(); // create client with defaults
                    client.on("error", err => {
                        console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
                        process.exit(1);
                    });
                    let result = client.existsAsync(user_mobile)
                    let cachedOTP;
                    if (result) {
                        cachedOTP = client.setAsync(user_mobile, otp);
                        client.expire(user_mobile, 300)
                    }
                    resolve("OTP has sucessfully sent to your number");
                }
            })
            
            /*request.get(sms_details.SMS_API_URL + "?user=" + sms_details.SMS_USER_ID + "&pass=" +
            sms_details.SMS_USER_PASSWORD + "&sender=" + sms_details.SMS_SENDER + "&phone=" +
            user_mobile + "&text=Your OTP is " + otp + " .This OTP expires in five minutes.&priority=ndnd")
            .then(smsresponse =>{
                bluebird.promisifyAll(redis.RedisClient.prototype);
                    bluebird.promisifyAll(redis.Multi.prototype);

                    const client = redis.createClient(); // create client with defaults
                    client.on("error", err => {
                        console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
                        process.exit(1);
                    });
                    let result = client.existsAsync(user_mobile)
                    let cachedOTP;
                    if (result) {
                        cachedOTP = client.setAsync(user_mobile, otp);
                        client.expire(user_mobile, 300)
                    }
                    resolve(smsresponse);
            }).catch(err =>{
                reject(err);
            })*/
    })
}


let findUserData = (loginData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                user_mobile: loginData.user_mobile,
                status: true
            })
            .populate('include_module', {
                modulename: 1,
                url_value: 1,
                module_class_name: 1,
                _id: 1
            }).populate('exclude_module', {
                modulename: 1,
                url_value: 1,
                module_class_name: 1,
                _id: 1
            })
            .then(userResponse => {
                resolve(userResponse)
            }).catch(err => {
                reject(err);
            })
    })
}


let findUserDetails = (loginData) => {
    return new Promise((resolve, reject) => {
        adminUser.findOne({
                _id: loginData.userid
            })
            .populate('include_module', {
                modulename: 1,
                url_value: 1,
                module_class_name: 1,
                _id: 1
            }).populate('exclude_module', {
                modulename: 1,
                url_value: 1,
                module_class_name: 1,
                _id: 1
            })
            .then(userResponse => {
                resolve(userResponse)
            }).catch(err => {
                reject(err);
            })
    })
}

export {
    adminUser,
    validateUser,
    userAdmin,
    filterUserAdmin,
    adminSearch,
    userRoleSearch,
    updateAdminUser,
    deleteUser,
    adminLogin,
    otpAdminLogin,
    genreateOTP,
    otpValidation,
    resendOTP,
    findPermittedModule,
    findUserData,
    findUserDetails,
    mobileValidation,
    emailValidation,
    mobileCheck,
    passwordCheck,
    updateResetPassword
};