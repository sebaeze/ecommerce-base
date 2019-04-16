/*
*  All db access init ( Cloudant, mongodb, mysql, etc ))
*/
var Cloudant            = require('cloudant') ;
var fs                  = require('fs')       ;
var resolvePath         = require('path').resolve ;
//
module.exports.classDb = class Db {
    //
    constructor(argDbtype,argCredentials){
        //
        console.log('argDbtype: '+argDbtype+';') ;
        console.log('process.env.CLOUDANT_CREDENTIALS: '+process.env.CLOUDANT_CREDENTIALS+';')  ;
        //
        this.credentials = argCredentials || (String(argDbtype).toUpperCase()=="cloudant" ? process.env.CLOUDANT_CREDENTIALS : false ) ;
        if ( this.credentials ){
            this.cloudantDb   = Cloudant( {url: this.credentials.url, maxAttempt: 5, plugins: [ 'iamauth', { retry: { retryDelayMultiplier: 4 } } ]} );
        } else {
            try {
                let fileContent  = fs.readFileSync( resolvePath('./server/dev/cloudantCredentials.json'), 'utf8');
                this.credentials = JSON.parse( fileContent ) ;
                this.cloudantDb  = Cloudant( {url: this.credentials.url, maxAttempt: 5, plugins: [ 'iamauth', { retry: { retryDelayMultiplier: 4 } } ]} );
            } catch(errReading){
                console.log('ERROR: reading credentials: ') ;
                console.dir(errReading) ;
                throw errReading ;
            }
        }
        //
        this.dbUsersName = 'dbusers' ;
        this.dbUsersCdb  ;
        //
        this.dbUserIndex = [
            { name:'EMAIL'           , type:'json', index:{fields:['email']      }} ,
            { name:'SERIAL'          , type:'json', index:{fields:['taxNumber']  }} ,
            { name:'TIPO'            , type:'json', index:{fields:['name']    }  }
        ] ;
        //
    }
    //
    mergeUser(argObjUser){
        return new Promise(async function(resDatos,resReject){
            try {
                //
                if ( !this.dbUsersCdb ){ this.dbUsersCdb=await this.crearDb(this.dbUsersName,this.dbUserIndex) ; }
                //
                this.findUser( Object.assign({},argObjUser) )
                    .then(function(respDatos){
                        if ( respDatos.length==0 ){
                            console.log('.... ** USUARIO NUEVO ****') ;
                            return this.addUser(argObjUser) ;
                        } else {
                            console.log('.... ya existe usuario...') ;
                            return respDatos ;
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
    findUser(argObjQuery){
        //
        return new Promise(async function(resDatos,resReject){
            try {
                //
                if ( !this.dbUsersCdb ){ this.dbUsersCdb=await this.crearDb(this.dbUsersName,this.dbUserIndex) ; }
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
                this.dbUsersCdb.find( objSelector ,function(err, result){
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
                if ( !this.dbUsersCdb ){ this.dbUsersCdb=await this.crearDb(this.dbUsersName,this.dbUserIndex) ; }
                //
                try{
                    let userObjDef    = {email:'',fullName:'',oathProvider:'',idOath:'',provider:'',nickname:'',first_name:'',last_name:'',phone:'',creation_ts:''} ;
                    let tempArrayDocs = argObjUser ;
                    if ( !Array.isArray(argObjUser) ){ tempArrayDocs = new Array( argObjUser ) ; }
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
                    this.dbUsersCdb.bulk( {docs: tempArrayDocs} , function(err, outResuDocumentos ){
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
    async crearDb(argDbNombre,argIndices){
        let outDb ;
        return new Promise(async function(resCrear,resReject){
            try {
                let flagDbNueva = true ;
                this.cloudantDb.db.create(argDbNombre, async function(errCreateDb, data) {
                    if ( errCreateDb ){
                        if ( errCreateDb.error=='file_exists' ){
                            flagDbNueva = false ;
                        } else {
                            console.dir(errCreateDb) ;
                            resReject( errCreateDb ) ;
                        }
                    }
                    outDb = await this.cloudantDb.db.use( argDbNombre ) ;
                    //
                    if ( flagDbNueva ) {
                        if ( argIndices ){
                            if ( !Array.isArray(argIndices) ){ argIndices=new Array(argIndices); }
                            for( let keyIndice in argIndices ){
                                let indexDef = argIndices[keyIndice] ;
                                let creaIndice = outDb.index(indexDef, function(err, response) {
                                    if (err) {resReject( err ); }
                                });
                            }
                        }
                        //
                        outDb.insert({
                            _id: "_design/names_database",
                            views: {
                                "names_database": {
                                    "map": "function (doc) {\n  emit(doc._id, [doc._rev, doc.new_name]);\n}"
                                }
                            }
                        },
                        function(err, data) { if(err){ console.log("View already exists."); } });
                    }
                    resCrear( outDb ) ;
                    //
                }.bind(this) ) ;
            } catch( errcreaDB ){
                resReject( errcreaDB ) ;
            }
        }.bind(this) )
    }
    //
}