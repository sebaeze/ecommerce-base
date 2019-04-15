/*
*
*/
function traceStats(req,res,next){
    //
    let contentType  = req.headers['content-type'] || 'html' ;
    console.log(req.method+' originalUrl: '+req.originalUrl+' url: '+req.url+' baseUrl: '+req.baseUrl+' contentType: '+contentType+';');
    if ( req.user ){
        console.dir(req.user) ;
    }
    next();
    //
} ;
//
module.exports=traceStats ;
//