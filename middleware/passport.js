const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users');
/**
 * Function to parse error
 * */
const pe = require('parse-error');


module.exports = function (passport){
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) =>{

        users.findById(jwt_payload.user_id,(error, data)=>{

            if(error) return done(pe[error], false);

            if(data) {
                return done(null, data);
            }else{
                return done(null, false);
            }
        });
    }));
};