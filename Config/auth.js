const jwt = require('jsonwebtoken');

module.exports = {

    generateToken(data) {
        return jwt.sign({
            user: data.user, role: data.role
        }, 'secKey', { expiresIn: 60 * 15/*60sec*15=15min*/ });
    },

    verifyAuth(req, res, next) {
        console.log('[auth]', req.session.token.split('.')[0]);
        jwt.verify(req.session.token, 'secKey', (err, authData) => {
            if (err) res.sendStatus(403);
            else {
                req.authData = authData;
                console.log(req.authData)
                next();
            }
        });

    },
    refresh_session(req, res) {
        req.session.a = 0;
        const data = req.authData;
        res.json(jwt.sign({
            user: data.user, role: data.role
        }, 'secKey', { expiresIn: 60 * 15/*60sec*15=15min*/ }))
    }
}
