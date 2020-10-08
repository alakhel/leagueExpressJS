const { generateToken } = require('../Config/auth');
const md5 = require('js-md5');
const accessLevel = require('../Config/config');
const { User } = require('../Model/User');

module.exports = {
    homePage(request, result) {
        console.log('\t...access to the Website')
        const user = new User('a', 'b', 10);
        user.log();
        result.sendFile(require('path').resolve(__dirname, '..') + '/view/index.html');
    },
    logMe(request, res) {
        const data = request.body;
        const passwordMD5 = md5(data.password);
        const sql = `SELECT PASSWORD, ROLES FROM USERS WHERE USERNAME='${
            data.user
            }'`
        db.query(sql, (err, result) => {
            if (err || result.length == 0) {
                res.sendStatus(401)
                console.log(err);
            } else {
                const gotPass = result[0].PASSWORD;
                const connected = passwordMD5 == gotPass;
                if (connected) {
                    const token = generateToken({ user: data.user, role: result[0].ROLES });
                    request.session.token = token;
                    const envelope = { pages: accessLevel.pages[result[0].ROLES] }
                    res.json(envelope);
                } else
                    res.sendStatus(401);
            }
        })
    },
};