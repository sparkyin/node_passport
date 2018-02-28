var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function (passport) {
    
    //passport session setup
    //save user data into passport session
    passport.serializeUser(function (user, done) {
        done(null, user.id); 
    });

    //get user data from passport session
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    /**local signup  */
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
    }, function (req, email, password, done) {
        process.nextTick(function () {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, function (err, user) {
                //if any error return error
                if (err)
                    return done(err);
                
                if (user) {
                    return done(null, false, req.flash('SignUpMessage', 'That email is already taken'));
                } else {
                    //if there is no user with that mail  
                    var newUser = new User();

                    //set user's local credentials 
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    //save user to database
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    /** local login strategy */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({ 'local.email': email }, function (err, user) {
            if (err)
                return done(err);
            
            //if no user is found, return the message

            if (!user)
                return done(null, false, req.flash('LoginMessage', 'No user found'));
            
            //if user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('LoginMessage', 'Oops! Wrong password.'));
            
            //all is well return successful user

            return done(null, user);
        });
    }));
}