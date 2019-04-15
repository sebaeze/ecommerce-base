/*
*    Passport configuration for our app
*/
var passport            = require('passport') ;
var LocalStrategy       = require('passport-local').Strategy;
var express             = require('express') ;
var router              = express.Router()   ;
//
//
const strategyPassport = new LocalStrategy(
        function(username, password, done) {
            console.log('...estoy en localStrategy..') ;
            console.log('.....user: '+username+' pass: '+password+';') ;
            let user = {
                username: username,
                password: password,
                mensaje: 'noseeeeeee'
            }
            return done(null, user);
        }
      ) ;
//
router.all('/loginUserPassword',
            passport.authenticate('local', {successRedirect: '/',
                                            failureRedirect: '/login',
                                            failureFlash: false
                                          })
) ;
//
const configPassportApp = (argApp) => {
  //
  passport.use( strategyPassport ) ;
  //
  passport.serializeUser(function(user, done) {
    console.log('....serializeUser: ') ;
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    console.log('....deserializeUser: ') ;
    console.dir(user) ;
    done(null, user);
  });
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