/*
*
*/
var express             = require('express') ;
var router              = express.Router()   ;
var resolvePath         = require('path').resolve      ;
var fs                  = require('fs')                ;
var traceStats          = require('../util/traceStats') ;
/*
* home page
*/
router.get('/'      , traceStats , function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', '*');
  //
  res.sendFile( resolvePath('./dist/index.html') ) ;
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
router.all('/error', traceStats, function(req,res){
    res.sendFile(  resolvePath('./dist/error.html')  ) ;
}) ;
//
module.exports = router;
//