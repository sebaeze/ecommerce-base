/*
*  Strategies for Passportjs
*/
const LocalStrategy        = require('passport-local').Strategy              ;
const GoogleStrategy       = require('passport-google-oauth').OAuth2Strategy ;
const MercadoLibreStrategy = require('passport-mercadolibre').Strategy       ;
const FacebookStrategy     = require('passport-facebook').Strategy           ;
const classDbUser          = require('../db/dbUser').classDbUser             ;
//
var dbEcommUser                = new classDbUser('cloudant') ;
//
const allStrategies = {
  'local':{
            strategy:new LocalStrategy(
                    function(username, password, done) {
                        console.log('...estoy en localStrategy..') ;
                        console.log('.....user: '+username+' pass: '+password+';') ;
                        let user = {
                            username: username,
                            password: password,
                            mensaje: 'noseeeeeee'
                        }
                        return done(null, user);
                    }),
                urlLogin: '/loginUserPassword',
                urlCallBack: false,
                scope: false
            },
  'google':{
            strategy:new GoogleStrategy({
                clientID: '777534133764-06vo7vojcj5dl7s4u0qt1f263kc8j30h.apps.googleusercontent.com',
                clientSecret: 'L_985JNK9Y9DSZmwfHpkxD1n',
                callbackURL: '/auth/google/callback'
            },
            (token, refreshToken, profile, done) => {
                dbEcommUser.mergeUser( profile ) ;
                return done(null, {
                    profile: profile,
                    token: token,
                    refreshToken: refreshToken
                });
            }),
            urlLogin: '/google',
            urlCallBack: '/google/callback',
            scope: ['https://www.googleapis.com/auth/userinfo.profile']
        },
   'mercadolibre':{
                    strategy:new MercadoLibreStrategy({
                    clientID: '2491781628284386',
                    clientSecret: 'GiDVCsGfc9YoYyyeVSVvKdrQtME7wkD0',
                    callbackURL: '/auth/mercadolibre/callback'
                },
                (token, refreshToken, profile, done) => {
                    dbEcommUser.mergeUser( profile ) ;
                    return done(null, {
                        profile: profile,
                        token: token
                    });
                }),
                urlLogin: '/mercadolibre',
                urlCallBack: '/mercadolibre/callback',
                scope: false
            },
    'facebook':{
                strategy:new FacebookStrategy({
                clientID: '383443742250970',
                clientSecret: 'a9e31d0fc60d82da287a50229d5bd0bf',
                callbackURL: '/auth/facebook/callback'
            },
            (token, refreshToken, profile, done) => {
                dbEcommUser.mergeUser( profile ) ;
                return done(null, {
                    profile: profile,
                    token: token
                });
            }),
            urlLogin: '/facebook',
            urlCallBack: '/facebook/callback',
            scope: false
        }
}
//
module.exports.strategies = allStrategies  ;
//