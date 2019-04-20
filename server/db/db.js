/*
*  All db access init ( Cloudant, mongodb, mysql, etc ))
*/
var Cloudant            = require('cloudant') ;
var fs                  = require('fs')       ;
var path                = require('path')     ;
//
module.exports.classDb = class Db {
    //
    constructor(argDbtype,argCredentials){
        //
        console.log('Db:argDbtype: '+argDbtype+';') ;
        console.log('process.env.CLOUDANT_CREDENTIALS: '+process.env.CLOUDANT_CREDENTIALS+';')  ;
        //
        this.credentials = argCredentials || (String(argDbtype).toUpperCase()=="CLOUDANT" ? process.env.CLOUDANT_CREDENTIALS : false ) ;
        if ( this.credentials ){
            if ( typeof this.credentials=="string" ){ this.credentials=JSON.parse(this.credentials); }
            this.cloudantDb   = Cloudant( {url: this.credentials.url, maxAttempt: 5, plugins: [ 'iamauth', { retry: { retryDelayMultiplier: 4 } } ]} );
        } else {
            try {
                let fileDir      = path.join(__dirname, '../dev/cloudantCredentials.json' ) ;
                let fileContent  = fs.readFileSync( fileDir, 'utf8');

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