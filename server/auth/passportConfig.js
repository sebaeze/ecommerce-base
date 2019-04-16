/*
*    Passport configuration for our app
*/
var passport            = require('passport') ;
var router              = require('express').Router()   ;
//
const strategies        = require('./passportStrategy').strategies ;
//
for ( let keyStrategy in strategies ){
  let objStrategy = strategies[keyStrategy] ;
  let objRedirects = { successRedirect: '/',
                         failureRedirect: '/login',
                         failureFlash: false
                      } ;
  if ( objStrategy.scope ){ objRedirects['scope']=objStrategy.scope; }
  if ( objStrategy.urlLogin ){
    router.all( objStrategy.urlLogin ,passport.authenticate(keyStrategy,objRedirects) ) ;
  }
  if ( objStrategy.urlCallBack ){
    router.all( objStrategy.urlCallBack ,
                passport.authenticate(keyStrategy,objRedirects)
              ) ;
  }
  passport.use( objStrategy.strategy ) ;
}
//
const configPassportApp = (argApp) => {
  //
  passport.serializeUser(function(user, done) { done(null, user)   ; });
  passport.deserializeUser(function(user, done) { done(null, user) ; });
  //
  argApp.use( passport.initialize() ) ;
  argApp.use( passport.session()    ) ;
  //
  return {
    routes: router
  } ;
  //
} ;
//
module.exports.configApp = configPassportApp ;
//