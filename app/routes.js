module.exports = function (app, passport) {
    /** home page */
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    /**login */
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('LoginMessage') });
    });

    /**login form submit */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    /**sign up */
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('SignUpMessage') });
    });

    /**sign up form submit */
    app.post('/signup', passport.authenticate('local-signup', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/signup',
        // allow flash messages
        failureFlash: true
    }));


    /**get profile */
    app.get('/profile',isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    /** logout */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
