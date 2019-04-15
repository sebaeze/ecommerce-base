const express        = require('express')     ;
const bodyParser     = require('body-parser') ;
const session        = require('express-session') ;
var cookieSession    = require('cookie-session')  ;
var MemoryStore      = require('session-memory-store')(session);
const path           = require('path')        ;
var fnConfigAppAuth  = require('./auth/passportConfig').configApp ;
var favicon          = require('serve-favicon');
//
const app            = express()              ;
/*
*
*/
// hack to make SSO work
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ secret: 'qaz11qaz', cookie: { maxAge: '1d' }}));
app.use(session({ secret: 'qaz11qaz',cookie: {path: '/',httpOnly: true,maxAge: null },proxy: true, resave: true,saveUninitialized: false, store: new MemoryStore() }));
//
/*
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() ;
  },
  secret: 'qaz11qaz',
  resave: false,
  saveUninitialized: true
}))
*/
//
app.use(express.static(path.join(__dirname, '../dist')));
//
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..dist', 'index.html'));
});
//app.use(favicon(__dirname + '../public/favicon.ico'));
/*
*   Rutas
*/
let passportConfig  = fnConfigAppAuth( app ) ;
//
var routerIndex         = require('./routes/routerIndex' ) ;
var routerApis          = require('./routes/routerApis' ) ;
//
app.use('/'         , routerIndex  ) ;
app.use('/api'      , routerApis   ) ;
//
app.use('/auth'      , passportConfig.routes ) ;
/*
*
*/
app.use(function(err, req, res, next) {
    console.log(' \n ******* (B) ERROR ********** ');
    console.dir(err) ;
    let mensajeError = '' ;
    if ( typeof err=='object' ){
        mensajeError = JSON.stringify(err) ;
    } else {
        mensajeError = err ;
    }
    res.redirect('/error?mensaje='+mensajeError) ;
});
//
/*
app.use(function(req, res, next) {
    console.log(' \n *** ERROR - 404 --> url: '+req.originalUrl+' *** \n');
    let flagAceptaJspon = ( req.headers.accept.toUpperCase().indexOf('APPLICATION/JSON')!=-1 ) ;
    //
    if ( flagAceptaJspon ) {
        res.status(404);
        res.send( { error: 'url: '+req.originalUrl+' Not found' } );
        return;
    }
    res.redirect('/error?mensaje=Url: '+req.originalUrl+' no fue encontrada.') ;
});
*/
/*
*
*/
let puerto = process.env.PORT || 3000  ;
app.listen(puerto,function(){
  console.log('....listen server on http://localhost:'+puerto) ;
});
//