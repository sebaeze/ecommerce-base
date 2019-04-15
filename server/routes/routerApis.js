/*
*   Rutas para las APIs del e-commerce
*/
var express             = require('express') ;
var router              = express.Router()   ;
var resolvePath         = require('path').resolve      ;
var traceStats          = require('../util/traceStats') ;
var apiDescription      = require('../config/APIdescription').apiDescription ;
//
var classUser           = require('./api/user').classUser ;
//
var apiUsers            = new classUser() ;
/*
* APIs list
*/
router.get('/'      , traceStats , function(req, res, next) {
    //
    res.set('Access-Control-Allow-Origin'  , '*' ) ;
    res.set('Access-Control-Allow-Methods' , '*' ) ;
    //
    let reqContenttype = req.headers['content-type'] || 'html' ;
    if ( reqContenttype.indexOf('application/json')!==-1 ){
        next() ;
    } else {
        next() ;
        //res.sendFile( resolvePath('./html/contabilidadBISSA.html') ) ;
    }
  //
},
function (req,res) {
    try {
        //
        res.status( 200  )   ;
        res.json( apiDescription ) ;
        //
    } catch( errDB2Listados ){
        console.dir(errDB2Listados) ;
        res.status( 500  ) ;
        res.json( {"error":errDB2Listados} );
    }
});
/*
*  user config
*/
router.get('/user'      , traceStats , function(req, res ) {
    res.set('Access-Control-Allow-Origin'  , '*' ) ;
    res.set('Access-Control-Allow-Methods' , '*' ) ;
    //
    res.status( 200  )   ;
    res.json( apiUsers.getuserInfo(req.user) ) ;
    //
});
//
router.all('/sitemap', traceStats, function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    //
    res.set('Content-Type', 'text/xml');
    let dirXml = resolvePath('./server/config/sitemapGoogle.xml') ;
    fs.readFile( dirXml , function(err, dataXML ) {
        res.send( dataXML ) ;
    });
    //
}) ;
//
//
module.exports = router;
//      