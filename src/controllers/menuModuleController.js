import {
    createModule,
    getList
} from "../models/menuModuleModel";


import {findUserData} from "../models/adminUserModel"
import {findModule} from "../models/userRoleModel"
import {moduleFind} from "../models/menuModuleModel"

let moduleCreation = (req, res, next)=> {
    let moduleData = req.body;
    let resObj;
    createModule(moduleData)
        .then(response => {
            resObj = {
                status: true,
                "response": {
                    "message": "Module created successfully",
                    "data": response
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

let modulelist = (req, res)=> {
    let moduleListData = req.body;
    let resObj;
    getList().
    then(moduleListResponse => {
        findUserData(moduleListData)
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
                    .then(modelResponse => {
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
                        let accessUrl = `/${req.headers.referer.split("/")[req.headers.referer.split("/").length-1]}`
                        let urlList = userPermitDataArr.map(u=>{
                            return u.url;
                        })
                        let checkExist = urlList.indexOf(accessUrl) > -1;
                        if(!checkExist){
                            res.send({
                                status: false,
                                "response": {
                                    "message": "Unauthorised Access",
                                }
                            })
                        }else {
                            resObj = {
                                status: true,
                                "response": {
                                    "message": "Module Created Successfully",
                                    "data": moduleListResponse
                                }
                            };
                            res.send(resObj)
                        }
                    })
            }
        })
    }).catch(err => {
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


export {
    moduleCreation,
    modulelist,
};