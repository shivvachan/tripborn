import jwt from 'jwt-simple';
import {validateUser} from '../models/adminUserModel'

const validateRequest = (req, res, next)=> {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['access-token'] || req.headers['access_token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    console.log("token",token);
    if (token || key) {
        try {
            var decoded = jwt.decode(token, require('../config/secret.js')());
            var userid = decoded.user_id;
            console.log("userid",userid)
            req.session.userid = decoded.user_id;
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }
            validateUser(userid).then((dbUser)=> {
                    if (dbUser) {
                        req.session.user_name = dbUser.user_name;
                        req.session.user_role = dbUser.user_role;
                        req.session.user_role_id = dbUser.user_role_id;
                        if (!req.session.user_role_id) {
                            res.status(401);
                            res.json({
                                "status": 401,
                                "message": "User role is missing!"
                            });
                            return;
                        }
                        next();
                    } else if ((req.url.indexOf('/userroleslist') >= 0)) {
                        req.session.userid = false;
                        next();
                    } else {
                        // No user with this name exists, respond back with a 401
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Invalid User"
                        });
                        return;
                    }
                })
        } catch (err) {
            if ((req.url.indexOf('/userroleslist') >= 0)) {
                req.session.userid = false;
                next(); // To move to next middleware
            } else {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Oops Token is not valid",
                    "error": err
                });
            }
        }
    } else {
        if ((req.url.indexOf('/userroleslist') >= 0)) {
            req.session.userid = false;
            next(); // To move to next middleware
        } else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid Token or Key"
            });
            return;
        }
    }
}

export default validateRequest;