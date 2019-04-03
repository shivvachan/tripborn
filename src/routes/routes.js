/*Controller routes */
import {
    userRoleCreation,
    userRoleUpdation,
    userRoleListDetails,
    userCreation,
    userList,
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
    searchUser,
    roleBasedSearch,
    busNextUserSearch,
    chnagePassword,
    passwordReset
} from "../controllers/userController";
import {
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
} from "../controllers/transactionController";
import {
    moduleCreation,
    modulelist
} from '../controllers/menuModuleController'
import {
    adminMessage
} from '../controllers/adminController.js'

import {
    providerCreation,
    providerList,
    providerUpdation
} from "../controllers/providerController";

import middleware from "../middileware/validateRequest.js";

//exports.assignRoutes = function (app) {
exports.assignRoutes = (app) => {

    app.get('/',(req,res)=>{
        res.send("Admin Backend");
    })

    /*Group Menu Creation*/
    app.post('/groupingmenucreation', groupMenuCreation);

    app.post('/createmodules', moduleCreation);

    app.post('/modulelisting', modulelist);

    app.post('/excludemoduleData', excludeFromPermittedModule);

    app.post('/includemoduleData', includeFromDeniedModule);

    app.post('/assignedrolemodule', assignedRoleModule);

    app.post('/getpermittedmodules', permittedModuleList);

    app.post('/createuserroles', userRoleCreation);

    app.post('/updaterole',userRoleUpdation);

    app.get('/userroleslist', userRoleListDetails); 



    app.post('/adminusercreation', userCreation); 

    app.post('/filteruserlist', middleware, userList); 

    app.post('/usersearch', searchUser);

    app.post('/userrolesearch', roleBasedSearch);

    app.post('/userMenuDetails', editDetailsData);

    app.post('/updateadminuser', middleware, UserUpdation); 

    app.post('/userdelete', middleware, userDeletion);

    app.post('/userlogin', adminUserlogin); 

    app.post('/validateotp', validateOTP); 

    app.post('/resendotp', otpResend); 

    app.post('/passwordchange', chnagePassword);

    app.post('/resetpassword', passwordReset);



    app.post('/viewalltransactiondetails', middleware, viewTransaction);

    app.post('/viewpendingtransactiondetails', middleware, pendingDetails);

    app.post('/searchfilter', middleware, search);

    app.post('/pnrsearch', middleware, searchByPnr);

    app.post('/viewsingletransaction', middleware, getSingleTransactionDetail);

    app.post('/statusfilter', middleware, filterStatus);

    app.post('/adminmessage', adminMessage);

    app.post('/busNextUser', getBusNextUserList);

    app.post('/searchbusnextuser', busNextUserSearch);


    app.post('/tocancelticketlist', cancelledList);

    app.post('/pnrsearchcancelledticket',cancelledTicketSearchByPnr)

    app.post('/tocancel', toCancel);

    app.post('/optionalsearchcancelledticket',cancelledTicketSearchByOption)


    app.post('/torefund', toRefund);

    app.post('/torefundviewlist', refundList);

    app.post('/pnrsearchrefundview',refundViewSearchByPnr);

    app.post('/optionalsearchrefundview',refundViewSearchByOption)

    app.post ('/canceledticket', cancelationStatus);

    /*GDS*/
    app.post('/addprovider',providerCreation);

    app.post('/listprovider',providerList);

    app.post('/updateProvider',providerUpdation);
}