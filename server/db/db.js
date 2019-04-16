/*
*  All db access init ( Cloudant, mongodb, mysql, etc ))
*/
var Cloudant            = require('cloudant') ;
//
module.exports.classDb = class Db {
    //
    constructor(argDbtype,argCredentials){
        this.credentials = argCredentials || (String(argDbtype).toUpperCase()=="cloudant" ? process.env.CLOUDANT_CREDENTIALS : {}) ;
        //
        this.dbUsersName = 'dbusers' ;
        this.dbUsersCdb  = 'dbusers' ;
        //
    }
    //

    //
}