import {
    createUserRole,
    updateUserRole,
    roleList,
    findModule,
    moduleAssigned,
    userrole_validation,
    excludepermittedModule,
    findPermittedID
} from "../models/userRoleModel";
import {
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

} from "../models/adminUserModel";

import {
    BusNextUserList,
    searchBusNext
} from "../models/busnextUserModel"

import {
    findAllModule,
    findNonMenuElementModule
} from '../models/menuModuleModel';

import {
    createMenu,
    menuGroup
} from '../models/menuGroupModel'

import jwt from "jwt-simple";

import async from 'async'

import apiList from "../utils/apiList";


let groupMenuCreation = (req, res, next) => {
    let menuData = req.body;
    let resObj;
    createMenu(menuData)
        .then(menuResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "Data Found Successfully",
                    "Data": menuResponse
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



let permittedModuleList = (req, res, next) => {
    let userData = req.body;
    let resObj;
    findPermittedModule(userData)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "Data Found Successfully",
                    "Data": response
                }
            };
            res.send(resObj)
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

let userRoleUpdation = (req,res,next)=>{
    let userRoleUpdateData = req.body;
    let resObj;
    updateUserRole(userRoleUpdateData)
        .then(modelResponse =>{
            resObj = {
                status: true,
                "response": {
                    "message": "User role updated successfully"
                }
            };
            res.send(resObj)
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


let userRoleCreation = (req, res, next) => {
    let userData = req.body;
    let resObj;
    userrole_validation(userData)
        .then(userroledata => {
            if (userroledata) {
                resObj = {
                    status: false,
                    "response": {
                        "data": "user already Exsit"
                    }
                };
                res.send(resObj);
            } else {
                findAllModule()
                    .then(moduleResponse => {
                        let data;
                        let newData;
                        let menuModuleArr = [];
                        for (let j = 0; j < moduleResponse.length; j++) {
                            data = moduleResponse[j];
                            newData = data._id;
                            menuModuleArr.push(newData)
                        }
                        let menuModuleID = menuModuleArr.map(String)
                        if (userData.permitted_module) {
                            let permittedModuleID = userData.permitted_module
                            let index;
                            for (let i = 0; i < permittedModuleID.length; i++) {
                                index = menuModuleID.indexOf(permittedModuleID[i]);
                                if (index > -1) {
                                    menuModuleID.splice(index, 1);
                                }
                            }
                            userData.permitted_module = permittedModuleID
                            createUserRole(userData)
                                .then(response => {
                                    resObj = {
                                        status: true,
                                        "response": {
                                            "message": "User Role Created Sucessfully",
                                            "Data": response
                                        }
                                    };
                                    res.send(resObj)
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
                        } else {
                            resObj = {
                                status: false,
                                "response": {
                                    "message": "Please Select Module",
                                }
                            };
                            res.send(resObj)
                        }

                    })
            }
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

let userRoleListDetails = (req, res, next) => {
    let resObj;
    roleList()
        .then(response => {
            let formattedArr = [];
            response.forEach(function(element) {
                let id = element._id;
                let user_role = element.user_role;
                let permitted_module = element.permitted_module;
                const formattedData = {
                    _id: id,
                    userRole: user_role,
                    allowedModule: permitted_module
                }
                formattedArr.push(formattedData);
                resObj = {
                    status: true,
                    "response": {
                        "message": "List Found Sucessfully",
                        "data": formattedArr
                    }
                };
            })
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

let excludeFromPermittedModule = (req, res, next) => {
    let roleID = req.body;
    let resObj;
    excludepermittedModule(roleID)
        .then(permittedresponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "List Found Sucessfully",
                    "data": permittedresponse
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


let includeFromDeniedModule = (req, res, next) => {
    let roleID = req.body;
    let resObj
    findAllModule()
        .then(moduleResponse => {
            let data;
            let newData;
            let moduleName;
            let menuModuleArr = [];
            let menuModuleName = [];
            for (let j = 0; j < moduleResponse.length; j++) {
                data = moduleResponse[j];
                newData = data._id,
                    moduleName = data.modulename
                menuModuleArr.push(newData)
                menuModuleName.push(moduleName)
            }
            findPermittedID(roleID)
                .then(permittedData => {
                    let permittedModule = permittedData[0].permitted_module
                    let data;
                    let newData;
                    let permittedModuleName;
                    let permittedModuleID = [];
                    let permittedModuleNameArr = [];
                    for (let k = 0; k < permittedModule.length; k++) {
                        data = permittedModule[k];
                        newData = data._id;
                        permittedModuleName = data.modulename;
                        permittedModuleID.push(newData)
                        permittedModuleNameArr.push(permittedModuleName);
                    }
                    let index;
                    for (let i = 0; i < permittedModuleNameArr.length; i++) {
                        index = menuModuleName.indexOf(permittedModuleNameArr[i]);
                        if (index > -1) {
                            menuModuleName.splice(index, 1);
                        }
                    }
                    let formatedElementArr = [];
                    menuModuleName.forEach(function(element) {
                        let formatedElementObject = {
                            "allowedModule": element
                        }
                        formatedElementArr.push(formatedElementObject)
                    })
                    resObj = {
                        status: true,
                        "response": {
                            "message": "Allowed Module Data Found Sucessfully",
                            "data": formatedElementArr
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

let userCreation = (req, res, next) => {
    let userData = req.body;
    let resObj;
    mobileValidation(userData)
        .then(mobiledbResponse => {
            console.log("mobiledbResponse", mobiledbResponse)
            if (mobiledbResponse) {
                resObj = {
                    status: false,
                    "response": {
                        "message": 'Mobile No Already Exsit',
                    }
                };
                res.send(resObj)
            } else {
                emailValidation(userData)
                    .then(emailResponse => {
                        if (emailResponse) {
                            resObj = {
                                status: false,
                                "response": {
                                    "message": 'Email Already Exsit',
                                }
                            };
                            res.send(resObj)
                        } else {
                            userAdmin(userData)
                                .then(response => {
                                    resObj = {
                                        status: true,
                                        "response": {
                                            "message": 'User Created Successfully',
                                            "user_id": response._id,
                                            "username": response.user_name,
                                            "access_token": genToken(response),
                                        }
                                    };
                                    res.send(resObj)
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
                    })
            }

        })
}



let userList = (req, res, next) => {
    let adminUserData = req.body;
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size)
    let resObj;
    filterUserAdmin(adminUserData, pageNo, size)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "filter user found sucessfully",
                    "data": response
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

let searchUser = (req, res, next) => {
    let searchData = req.body;
    let resObj;
    adminSearch(searchData)
        .then(searchResponse => {
            resObj = {
                status: true,
                "response": {
                    "data": searchResponse
                }
            };
            res.send(resObj);
        }).catch(err => {
            console.log("err", err);
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        })
}

let roleBasedSearch = (req, res, next) => {
    let roleidData = req.body;
    let resObj;
    userRoleSearch(roleidData)
        .then(roleResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "User Role found sucessfully",
                    "data": roleResponse
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

let editDetailsData = (req, res, next) => {
    let loginData = req.body;
    let resObj;
    let deniedModuleSet
    findUserData(loginData)
        .then(userDbResponse => {
            if (userDbResponse == null) {
                resObj = {
                    status: false,
                    "response": {
                        "message": "Incorrect Mobile No"
                    }
                };
                res.send(resObj);
            } else {
                let roleID = userDbResponse.user_role_id;
                let permittedModule = userDbResponse.include_module;
                let deniedModule = userDbResponse.exclude_module;
                let data;
                let moduleName;
                let urlName;
                let moduleClassName;
                let permittedModuleArr = []
                let deniedModuleArr = [];
                let permittedObject;
                let deniedobject;
                let id;
                /*find Module Name */
                for (let j = 0; j < permittedModule.length; j++) {
                    data = permittedModule[j];
                    id = data._id
                    moduleName = data.modulename;
                    urlName = data.url_value;
                    moduleClassName = data.module_class_name;
                    permittedObject = {
                        _id: id,
                        moduleName: moduleName,
                        url: urlName,
                        moduleClassName: moduleClassName
                    }
                    permittedModuleArr.push(permittedObject)
                }
                for (let k = 0; k < deniedModule.length; k++) {
                    data = deniedModule[k];
                    id = data._id
                    moduleName = data.modulename;
                    urlName = data.url_value;
                    moduleClassName = data.module_class_name;
                    deniedobject = {
                        _id: id,
                        moduleName: moduleName,
                        url: urlName,
                        moduleClassName: moduleClassName
                    }
                    deniedModuleArr.push(deniedobject);
                }
                let index;
                findModule(roleID)
                    .then(modelResponse => {
                        let userPermittedModule = modelResponse.permitted_module;
                        let data;
                        let moduleName;
                        let urlName;
                        let moduleClassName;
                        let userPermitDataArr = [];
                        let permittedModuleObject;
                        let id;

                        for (let i = 0; i < userPermittedModule.length; i++) {
                            data = userPermittedModule[i];
                            moduleName = data.modulename;
                            urlName = data.url_value;
                            id = data._id
                            moduleClassName = data.module_class_name;
                            permittedModuleObject = {
                                _id: id,
                                moduleName: moduleName,
                                url: urlName,
                                moduleClassName: moduleClassName
                            }
                            userPermitDataArr.push(permittedModuleObject);
                        }
                        if (permittedModuleArr.length > 0 && deniedModuleArr.length > 0) {
                            if (permittedModuleArr.length > 0) {
                                userPermitDataArr.push(...permittedModuleArr)
                            }
                            if (deniedModuleArr.length > 0) {
                                let deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                                userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                            }
                        } else if (permittedModuleArr.length > 0) {
                            userPermitDataArr.push(...permittedModuleArr)
                        } else if (deniedModuleArr.length > 0) {
                            deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                            userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                        } else {
                            userPermitDataArr;
                        }
                        let accessUrlList = apiList;
                        userPermitDataArr.map(u => {
                            accessUrlList.push(u.url);
                        });
                        let menuElementArr = [];
                        userPermitDataArr.forEach(function(element) {
                            let menuModule = element
                            menuElementArr.push(menuModule)
                        })
                        menuElementArr.map(user => {
                            user["value"] = user.moduleName;
                            user["key"] = user._id;
                            user["text"] = user.moduleName;
                        })
                        findNonMenuElementModule()
                            .then(response => {
                                let nonMenuElement = [];
                                let formatttedResponseobj;
                                response.map(result => {
                                    let id = result._id;
                                    let moduleName = result.modulename;
                                    let url = result.url_value;
                                    let moduleClassName = result.module_class_name;
                                    formatttedResponseobj = {
                                        _id: id,
                                        moduleName: moduleName,
                                        url: url,
                                        moduleClassName: moduleClassName
                                    }
                                    nonMenuElement.push(formatttedResponseobj)
                                })
                                let deniedModuleSet = menuElementArr.reduce((a, c) => a.add(c.moduleName), new Set());
                                nonMenuElement = nonMenuElement.filter(v => !deniedModuleSet.has(v.moduleName));
                                nonMenuElement.map(user => {
                                    user["value"] = user.moduleName;
                                    user["key"] = user._id;
                                    user["text"] = user.moduleName;
                                })

                                let resArr = []
                                let resobj = {
                                    _id: userDbResponse._id,
                                    include_module: userDbResponse.include_module,
                                    exclude_module: userDbResponse.exclude_module,
                                    menu: menuElementArr,
                                    non_Menu: nonMenuElement,
                                    user_name: userDbResponse.user_name,
                                    user_email: userDbResponse.user_email,
                                    user_mobile: userDbResponse.user_mobile,
                                    user_role: userDbResponse.user_role,
                                    user_role_id: userDbResponse.user_role_id,
                                    created_on: userDbResponse.created_on
                                }
                                resArr.push(resobj);
                                resObj = {
                                    status: true,
                                    "response": {
                                        "Data": resArr
                                    }
                                };
                                res.send(resObj);
                            })

                    })
            }
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


let UserUpdation = (req, res, next) => {
    let userUpdateData = req.body;
    let resObj;
    updateAdminUser(userUpdateData)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "user updated sucessfully"
                }
            };
            res.send(resObj)
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


let userDeletion = (req, res, next) => {
    let reqData = req.body;
    let resObj;
    deleteUser(reqData)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "user deleted sucessfully"
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


let adminUserlogin = async (req, res, next) => {
    let loginData = req.body;
    let resObj;
    if (loginData.cookieValidation == true) {

        findUserData(loginData)
            .then(userDbResponse => {
                if (userDbResponse == null) {
                    resObj = {
                        status: false,
                        "response": {
                            "message": "Incorrect Mobile No"
                        }
                    };
                    res.send(resObj);
                } else {
                    let roleID = userDbResponse.user_role_id;
                    let permittedModule = userDbResponse.include_module;
                    let deniedModule = userDbResponse.exclude_module;
                    let data;
                    let moduleName;
                    let urlName;
                    let moduleClassName;
                    let permittedModuleArr = []
                    let deniedModuleArr = [];
                    let permittedObject;
                    let deniedobject;
                    /*find Module Name */
                    for (let j = 0; j < permittedModule.length; j++) {
                        data = permittedModule[j];
                        moduleName = data.modulename;
                        urlName = data.url_value;
                        moduleClassName = data.module_class_name;
                        permittedObject = {
                            moduleName: moduleName,
                            url: urlName,
                            moduleClassName: moduleClassName
                        }
                        permittedModuleArr.push(permittedObject)
                    }
                    for (let k = 0; k < deniedModule.length; k++) {
                        data = deniedModule[k];
                        moduleName = data.modulename;
                        urlName = data.url_value;
                        moduleClassName = data.module_class_name;
                        deniedobject = {
                            moduleName: moduleName,
                            url: urlName,
                            moduleClassName: moduleClassName
                        }
                        deniedModuleArr.push(deniedobject);
                    }
                    let index;
                    findModule(roleID)
                        .then(async modelResponse => {
                            let userPermittedModule = modelResponse.permitted_module;
                            let data;
                            let moduleName;
                            let urlName;
                            let moduleClassName;
                            let userPermitDataArr = [];
                            let permittedModuleObject;
                            for (let i = 0; i < userPermittedModule.length; i++) {
                                data = userPermittedModule[i];
                                moduleName = data.modulename;
                                urlName = data.url_value;
                                moduleClassName = data.module_class_name;
                                permittedModuleObject = {
                                    moduleName: moduleName,
                                    url: urlName,
                                    moduleClassName: moduleClassName
                                }
                                userPermitDataArr.push(permittedModuleObject);
                            }
                            if (permittedModuleArr.length > 0 && deniedModuleArr.length > 0) {
                                if (permittedModuleArr.length > 0) {
                                    userPermitDataArr.push(...permittedModuleArr)
                                }
                                if (deniedModuleArr.length > 0) {
                                    let deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                                    userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                                }
                            } else if (permittedModuleArr.length > 0) {
                                userPermitDataArr.push(...permittedModuleArr)
                            } else if (deniedModuleArr.length > 0) {
                                let deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                                userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                            } else {
                                userPermitDataArr;
                            }
                            let accessUrlList = apiList;
                            userPermitDataArr.map(u => {
                                accessUrlList.push(u.url);
                            });
                            let menuElementArr = [];
                            userPermitDataArr.forEach(function(element) {
                                let menuModule = element
                                menuElementArr.push(menuModule)
                            })
                            let formattedArr = [];
                            await menuGroup()
                                .then(menuGroupData => {
                                    menuGroupData.forEach(function(element) {
                                        let final = {}
                                        final.position = element.position;
                                        final.displayName = element.display_name;
                                        final.item = [];
                                        element.group_menu_url.map(e => {
                                            menuElementArr.map(menu => {
                                                if (e === menu.url) {
                                                    final.item.push(menu);
                                                }
                                            })
                                        });
                                        if (final.item.length > 0) {
                                            formattedArr.push(final)
                                        }
                                    });
                                    mobileCheck(loginData)
                                        .then(mobileLogValidation => {
                                            if (!mobileLogValidation) {
                                                resObj = {
                                                    status: false,
                                                    "response": {
                                                        "message": 'Mobile No Incorrect',
                                                    }
                                                };
                                                res.send(resObj)
                                            } else {
                                                passwordCheck(loginData)
                                                    .then(passworddbResponse => {
                                                        if (!passworddbResponse) {
                                                            resObj = {
                                                                status: false,
                                                                "response": {
                                                                    "message": 'Password Incorrect',
                                                                }
                                                            };
                                                            res.send(resObj)
                                                        } else {
                                                            console.log("loginData",loginData);
                                                            adminLogin(loginData)
                                                                .then(response => {
                                                                    if (response.length > 0) {
                                                                        response.forEach(function(element) {
                                                                            resObj = {
                                                                                status: true,
                                                                                "response": {
                                                                                    "message": "Logged in successfully",
                                                                                    "user_role": response[0].user_role,
                                                                                    "menu": menuElementArr,
                                                                                    "submenu": formattedArr,
                                                                                    "user_id": response[0]._id,
                                                                                    "access_token": genToken(element)
                                                                                }
                                                                            };
                                                                            res.send(resObj);
                                                                        })
                                                                    } else {
                                                                        resObj = {
                                                                            status: false,
                                                                            "response": {
                                                                                "message": "Logedin Failed"
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
                                                    })
                                            }
                                        })
                                });

                        })
                }
            })
    } else if (loginData.cookieValidation == false) {
        mobileCheck(loginData)
            .then(mobileLogValidation => {
                if (!mobileLogValidation) {
                    resObj = {
                        status: false,
                        "response": {
                            "message": 'Mobile No Incorrect',
                        }
                    };
                    res.send(resObj)
                } else {
                    passwordCheck(loginData)
                        .then(passworddbResponse => {
                            if (!passworddbResponse) {
                                resObj = {
                                    status: false,
                                    "response": {
                                        "message": 'Password Incorrect',
                                    }
                                };
                                res.send(resObj)
                            } else {
                                genreateOTP(loginData)
                                    .then(otpResponse => {
                                        resObj = {
                                            status: true,
                                            "response": {
                                                "message": "OTP sucessfully sent to your mobile and email",
                                                "user_id": otpResponse._id,
                                            }
                                        }
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
                        })
                }
            })
    } else {
        resObj = {
            status: false,
            "response": {
                "message": "something went wrong"
            }
        };
        res.status(400).send(resObj);
    }
}

let validateOTP = async (req, res, next) => {
    let loginData = req.body;
    let resObj;
    otpValidation(loginData)
        .then(otpResponse => {
            if (otpResponse === null) {
                resObj = {
                    status: false,
                    "response": {
                        "message": "OTP has expired! Please login with new OTP",
                    }
                }
                res.send(resObj);
            }
            if (loginData.otp === +otpResponse) {
                findUserDetails(loginData)
                    .then(userDbResponse => {
                        console.log("userDbResponse", userDbResponse)
                        let userMobile = userDbResponse.user_mobile
                        let passcode = userDbResponse.password
                        let roleID = userDbResponse.user_role_id;
                        let permittedModule = userDbResponse.include_module;
                        let deniedModule = userDbResponse.exclude_module;
                        let data;
                        let newData;
                        let permittedModuleArr = []
                        let deniedModuleArr = [];
                        let permittedObject;
                        let deniedobject;
                        let moduleName;
                        let url;
                        let urlName;
                        let moduleClassName;
                        for (let j = 0; j < permittedModule.length; j++) {
                            data = permittedModule[j];
                            moduleName = data.modulename;
                            urlName = data.url_value;
                            moduleClassName = data.module_class_name;
                            permittedObject = {
                                moduleName: moduleName,
                                url: urlName,
                                moduleClassName: moduleClassName
                            }
                            permittedModuleArr.push(permittedObject)
                        }
                        for (let k = 0; k < deniedModule.length; k++) {
                            data = deniedModule[k];
                            moduleName = data.modulename;
                            urlName = data.url_value;
                            moduleClassName = data.module_class_name;
                            deniedobject = {
                                moduleName: moduleName,
                                url: urlName,
                                moduleClassName: moduleClassName
                            }
                            deniedModuleArr.push(deniedobject);
                        }
                        let index;
                        findModule(roleID)
                            .then(async modelResponse => {
                                let userPermittedModule = modelResponse.permitted_module;
                                let data;
                                let moduleName;
                                let urlName;
                                let moduleClassName;
                                let userPermitDataArr = [];
                                let permittedModuleObject;
                                for (let i = 0; i < userPermittedModule.length; i++) {
                                    data = userPermittedModule[i];
                                    moduleName = data.modulename;
                                    urlName = data.url_value;
                                    moduleClassName = data.module_class_name;
                                    permittedModuleObject = {
                                        moduleName: moduleName,
                                        url: urlName,
                                        moduleClassName: moduleClassName
                                    }
                                    userPermitDataArr.push(permittedModuleObject);
                                }
                                if (permittedModuleArr.length > 0 && deniedModuleArr.length > 0) {
                                    if (permittedModuleArr.length > 0) {
                                        userPermitDataArr.push(...permittedModuleArr)
                                    }
                                    if (deniedModuleArr.length > 0) {
                                        let deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                                        userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                                    }
                                } else if (permittedModuleArr.length > 0) {
                                    userPermitDataArr.push(...permittedModuleArr)
                                } else if (deniedModuleArr.length > 0) {
                                    let deniedModuleSet = deniedModuleArr.reduce((a, c) => a.add(c.url), new Set());
                                    userPermitDataArr = userPermitDataArr.filter(v => !deniedModuleSet.has(v.url));
                                } else {
                                    userPermitDataArr;
                                }
                                let menuElementArr = [];
                                userPermitDataArr.forEach(function(element) {
                                    let menuModule = element
                                    menuElementArr.push(menuModule)
                                })
                                let formattedArr = [];
                                await menuGroup()
                                    .then(menuGroupData => {
                                        menuGroupData.forEach(function(element) {
                                            let final = {}
                                            final.position = element.position;
                                            final.displayName = element.display_name;
                                            final.item = [];
                                            if (menuElementArr.length > 0) {
                                                element.group_menu_url.map(e => {
                                                    menuElementArr.map(menu => {
                                                        if (e === menu.url) {
                                                            final.item.push(menu);
                                                        }
                                                    })
                                                });
                                                if (final.item.length > 0) {
                                                    formattedArr.push(final)
                                                }
                                            }
                                        });
                                        let menuElementArrData = [];
                                        userPermitDataArr.forEach(function(element) {
                                            menuElementArrData.push(element)
                                        })
                                        otpAdminLogin(loginData, passcode, userMobile)
                                            .then(response => {
                                                resObj = {
                                                    status: true,
                                                    "response": {
                                                        "msg": true,
                                                        "message": "Login Successfully",
                                                        "user_role": response.user_role,
                                                        "menu": menuElementArrData,
                                                        "submenu": formattedArr,
                                                        "user_id": response._id,
                                                        "access_token": genToken(response)
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
                                            });
                                    });
                            });
                    });

            } else {
                resObj = {
                    status: true,
                    "response": {
                        "msg": false,
                        "data": "The OTP entered is incorrect."
                    }
                };
                res.send(resObj)
            };
        })
        .catch(err => {
            console.log("err",err);
            resObj = {
                status: false,
                "response": {
                    "message": err
                }
            };
            res.status(400).send(resObj);
        });
}




let passwordReset = (req, res, next) => {
    let resetPasswordData = req.body;
    let resObj;
    otpValidation(resetPasswordData)
        .then(otpResponse => {
            console.log("otpResponse",otpResponse);
            if (otpResponse === null) {
                resObj = {
                    status: false,
                    "response": {
                        "message": "OTP has expired! Please reset your password with new OTP",
                    }
                }
                res.send(resObj);
            }
            if (resetPasswordData.otp === +otpResponse) {
                updateResetPassword(resetPasswordData)
                    .then(updatedResponse => {
                        resObj = {
                            status: true,
                            "response": {
                                "msg": true,
                                "message": "Password Sucessfully Updated",
                            }
                        }
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
            } else {
                resObj = {
                    status: true,
                    "response": {
                        "msg": false,
                        "message": "The OTP entered is incorrect."
                    }
                };
                res.send(resObj)
            };
        })
}


let chnagePassword = (req, res, next) => {
    let passwordUserData = req.body;
    let resObj;
    mobileCheck(passwordUserData)
        .then(mobileLogValidation => {
            if (!mobileLogValidation) {
                resObj = {
                    status: false,
                    "response": {
                        "message": 'Mobile No Incorrect',
                    }
                };
                res.send(resObj)
            } else {
                if (passwordUserData.newPwd == passwordUserData.cnfPwd) {
                    genreateOTP(passwordUserData)
                        .then(otpResponse => {
                            resObj = {
                                status: true,
                                "response": {
                                    "message": "OTP sucessfully sent to your mobile and email",
                                    "user_id": otpResponse._id,
                                }
                            }
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
                } else {
                    resObj = {
                        status: false,
                        "response": {
                            "message": 'Password Not Matched',
                        }
                    };
                    res.send(resObj)
                }
            }
        })

}


function genToken(user) {
    const expires = expiresIn(30); // 30 day
    let token = jwt.encode({
        exp: expires,
        user_id: user._id
    }, require('../config/secret')());
    return token;
}

function expiresIn(numDays) {
    let dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}


let otpResend = (req, res, next) => {
    let resendOTPData = req.body;
    let resObj;
    resendOTP(resendOTPData)
        .then(resendotpReseponse => {
            resObj = {
                status: true,
                "response": {
                    "message": resendotpReseponse
                }
            };
            res.send(resObj);
        })
        .catch(err => {
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

let assignedRoleModule = (req, res, next) => {
    let resObj;
    moduleAssigned()
        .then(modelResponse => {
            resObj = {
                status: true,
                "response": {
                    "message": "found sucessfully",
                    "data": modelResponse
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
        });
};

let getBusNextUserList = (req, res, next) => {
    let resObj;
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size)
    BusNextUserList(pageNo, size)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "BusNext User found sucessfully",
                    "data": response
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
        });
}

let busNextUserSearch = (req, res, next) => {
    let userSearchData = req.body;
    let resObj;
    searchBusNext(userSearchData)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "BusNext User found sucessfully",
                    "data": response
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
        });
}


export {
    userRoleCreation,
    userRoleListDetails,
    userCreation,
    userRoleUpdation,
    userList,
    roleBasedSearch,
    searchUser,
    UserUpdation,
    userDeletion,
    adminUserlogin,
    validateOTP,
    otpResend,
    permittedModuleList,
    assignedRoleModule,
    excludeFromPermittedModule,
    includeFromDeniedModule,
    groupMenuCreation,
    editDetailsData,
    getBusNextUserList,
    busNextUserSearch,
    chnagePassword,
    passwordReset
};