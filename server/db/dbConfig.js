/*
*   Configurations for app
*/
const ClassDb           = require('./db').classDb ;
//
module.exports.classDbConfig = class DbConfig extends ClassDb {
    //
    constructor(argDbtype,argCredentials=false){
        //
        console.log('ClassDbConfig::argDbtype: '+argDbtype+';') ;
        super(argDbtype,argCredentials) ;
        //
        this.dbConfigName = 'dbconfig' ;
        this.dbUserIndex = [
            { name:'PARAMETER'      , type:'json', index:{fields:['name']      }}
        ] ;
        this.dbConfigCdb  = await this.crearDb(this.dbConfigName,this.dbUserIndex) ;
        //
        this.defaultObjectUser = {email:'',fullName:'',firstName:'',lastName:'',creationTs:'',lastSessionTs:'',preferences:{},userConecctions:{},fullAddress:'',street:'',city:'',state:'',province:'',country:'',phone:'',zipCode:'',additionalInfo:'',geoLocation:'',followedSellers:[],lastUpdateTs:'',mercadolibreRegistrationTs:''} ;
        //
    }
    //
    mergeUser(argObjUser){
        return new Promise(async function(resDatos,resReject){
            try {
                //
                if ( !argObjUser.provider ){ argObjUser.provider='*** NOT DEFINED ***'; }
                console.log('...mergeUser::Provider:: '+argObjUser.provider+';') ;
                this.findUser( argObjUser )
                    .then(function(respDatos){
                        let tempPreviousUser = this.defaultObjectUser ;
                        if ( respDatos.length>0 ){
                            console.log('.... ** EXISTE:: VOY A MERGE PROVIDER ****') ;
                            let tempPreviousUser = respDatos ;
                        }
                        return this.parseMergeUser(tempPreviousUser,argObjUser) ;
                    }.bind(this))
                    .then(function(argDatos2Merge){
                        if ( argDatos2Merge.modified ){
                            return this.addUser( argDatos2Merge.result ) ;
                        } else {
                            return argDatos2Merge.result ;
                        }
                    }.bind(this))
                    .then(function(respDatosUser){
                        resDatos( respDatosUser ) ;
                    })
                    .catch(function(errMergeUser){
                        console.log('....mergeUser::ERROR: ') ;
                        console.dir(errMergeUser) ;
                        resReject( errMergeUser ) ;
                    }) ;
                //
            } catch( errProm ){
                resReject(errProm) ;
            }
        }.bind(this) ) ;
    }
    //
    parseMergeUser(argObjUserPrevious,argObjUsr){
        console.log('...estoy en parseMergeUser ') ;
        let outMergeUser = {modified:false,result:{}} ;
        try{
            outMergeUser.result = argObjUserPrevious ;
            //
            console.dir(argObjUsr) ;
            console.log('....argObjUserPrevious.provider: '+argObjUserPrevious.provider
                        +' newUserProvider: '+argObjUsr.provider
                        +';') ;
            //
            const indexProvider = (argProvider) => {
                let outIndex       = -1 ;
                let arrayProviders = Object.keys(outMergeUser.result.userConecctions) ;
                outIndex           = arrayProviders.find(function(argPRov){ return argPRov.provider==argProvider ; }) || -1 ;
                return outIndex ;
            } ;
            //
            if ( indexProvider(argObjUsr.provider)==-1 ){
                outMergeUser.result.userConecctions[argObjUsr.provider]={
                    provider: argObjUsr.provider,
                    creationTs: new Date().toISOString(),
                    id: argObjUsr.id || '',
                    nickName:argObjUsr.nickName||''
                } ;
                switch( String(argObjUsr.provider).toUpperCase() ){
                    case 'MERCADOLIBRE':
                        outMergeUser.result=Object.assign(outMergeUser.result,argObjUsr._json) ;
                        outMergeUser.result.fullname = '' ;
                    break;
                    case 'GOOGLE':
                        outMergeUser.result=Object.assign(outMergeUser.result,argObjUsr) ;
                    break;
                    case 'FACEBOOK':
                    outMergeUser.result=Object.assign(outMergeUser.result,argObjUsr) ;
                    break;
                    default:
                        throw new Error('parseMergeUser:: Provider not found: '+argObjUsr.provider+';') ;
                }
            }
            //
        } catch(errParseMerge){
            console.log('ERROR: parseMergeUser:: ') ;
            console.dir(errParseMerge) ;
            throw errParseMerge ;
        }
        return outMergeUser ;
    }
    //
    findUser(argObjQuery){
        //
        return new Promise(async function(resDatos,resReject){
            try {
                //
                let selectorBusca =  (argObjQuery._id          ? {'_id':argObjQuery._id    } : false)
                                  || (argObjQuery.email        ? {'email':argObjQuery.email} : false )
                                  || (argObjQuery.fullName     ? {'fullName':argObjQuery.fullName} : false )
                                  || (argObjQuery.displayName  ? {'fullName':argObjQuery.displayName} : false )
                                  || (argObjQuery.id           ? {'idOath':argObjQuery.id} : false ) ;
                console.dir(selectorBusca);
                //
                let objSelector = { selector: selectorBusca }
                //
                this.dbConfigCdb.find( objSelector ,function(err, result){
                    if (err) {
                        console.dir(err) ;
                        resReject( err ) ;
                    } else {
                        resDatos( result.docs ) ;
                    }
                    //
                });
                //
            } catch( errProm ){
                resReject(errProm) ;
            }
        }.bind(this) ) ;
    }
    //
    addUser(argObjUser){
        return new Promise(async function(resDatos,resReject){
            try {
                //
                try{
                    let userObjDef    = {email:'',fullName:'',oathProvider:'',idOath:'',provider:'',nickname:'',first_name:'',last_name:'',phone:'',creation_ts:''} ;
                    let tempArrayDocs = argObjUser ;
                    if ( !Array.isArray(argObjUser) ){ throw new Error("addUser:: argumento should be array") ; }
                    tempArrayDocs.forEach(function(argUsr){
                        if ( argUsr._json ){
                            argUsr = Object.assign(argUsr,argUsr._json) ;
                        }
                        if ( !argUsr.idOath & argUsr.id ){ argUsr.idOath=argUsr.id; }
                        if ( !argUsr.oathProvider ){argUsr.oathProvider= argUsr.provider ? argUsr.provider : ''; }
                        if ( !argUsr.fullName ){
                            argUsr.fullName =  ( argUsr.displayName ? argUsr.displayName : false )
                                            || ( argUsr.first_name ? argUsr.first_name+' '+argUsr.last_name : false )
                                            || ' ' ;
                        }
                        if ( argUsr.id ){ argUsr.idOath=argUsr.id; }
                        if ( argUsr.id ){ argUsr.idOath=argUsr.id; }
                        if ( argUsr._json ){ delete argUsr._json; }
                        if ( argUsr._raw  ){ delete argUsr._raw; }
                        //
                        argUsr.creation_ts = new Date().toISOString() ;
                        let newObj         = Object.assign(userObjDef,argUsr) ;
                        argUsr = newObj ;
                        //
                    }.bind(this));
                    //
                    this.dbConfigCdb.bulk( {docs: tempArrayDocs} , function(err, outResuDocumentos ){
                        if ( err ){
                            console.dir(err.error,err.reason,err.statusCode) ;
                            console.log('...ERROR: Insertando arrayUsuarios') ;
                            console.dir(tempArrayDocs) ;
                            resReject( err ) ;
                        } else {
                            resDatos( tempArrayDocs ) ;
                        }
                    }.bind(this)) ;
                    //
                } catch( errInsertDoc ){
                    resReject(errInsertDoc) ;
                }
            } catch( errProm ){
                resReject(errProm) ;
            }
        }.bind(this) ) ;
    }
    //
}