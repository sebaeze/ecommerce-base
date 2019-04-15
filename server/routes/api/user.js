/*
*
*/
module.exports.classUser = class classUser {
    // Default constructor
    constructor(){}
    //
    getuserInfo(argUserObj={}){
        let outUserInfo = {result:[]} ;
        try{
            if ( argUserObj.email ){
                outUserInfo.result.push(' aca tengo que tener un email: '+argUserObj.email+'.') ;
            } else {
                outUserInfo.error =  'User not logged' ;
            }
        } catch(errUserInfo){
            outUserInfo.error =  'ERROR procesing API user: '+errUserInfo ;
        }
        return outUserInfo ;
    }
    //
}
//*