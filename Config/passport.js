const LocalStrategy = require('passport-local').Strategy

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            /**
             * lookForUser(email) => not found call done(err)
             * @foundUser :
             * check for password => not_correct => done(null, false)
             *                          correct => done(user)
            */
        })
    )
}
//mainServer
const passport = require('passport');
const localPassport = require(./passport.js)(passport);

//login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    })(res, req, next)
})
//logout
router.get('/logout', (req, res) => {
    req.logout()
})

//verify auth
verifyAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }

router.get('/dash', verifyAuth, (req, res, next) => {
        res.send('ok')
    })