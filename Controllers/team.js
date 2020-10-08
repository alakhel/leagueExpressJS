const { sendMail } = require('../Config/gmail');
const md5 = require('js-md5');
const { Team } = require('../Model/Team');
const { User } = require('../Model/User');
module.exports = {
    addTeam(req, res) {
        console.log(req.body)
        const team = new Team(req.body);
        team.log()
        team.save(db)
            .then((result) => console.log(result))
            .catch((err) => console.log(err))
        res.status(201).send('Done!');
    },
    addUser(req, res) {
        const user = new User(req.body.username, req.body.password);
        user.log()
        user.save(db)
            .then((result) => console.log(result))
            .catch((err) => console.log(err))
        res.status(201).send('Done!');
    },
    addTeam_(request, result) {
        const body = request.body;
        const data = JSON.parse(body.team)
        if (request.files) request.files.logo.mv('./view/flags/' + data.team.teamName);
        const password = data.team.teamName + time().join('');
        const passwordMD5 = md5(password);
        const sql0 = 'INSERT INTO USERS (USERNAME, PASSWORD, ROLES) VALUES ?'
        const entries0 = [[[data.team.email, passwordMD5, 10]]];
        db.query(sql0, entries0, (err, res) => {
            if (err) console.log(err);
            else if (debug) console.log('[USER] inserted : ...', res.affectedRows);
        });

        const sql = 'INSERT INTO TEAM (TEAMNAME, TRAINERNAME, USER) VALUES ?'
        const entries = [[[data.team.teamName, data.team.trainerName, data.team.email]]];
        db.query(sql, entries, (err, res) => {
            if (err) console.log(err);
            else if (debug) {
                console.log('[TEAM] inserted : ...', res);
                const players = data.team.player.map((v) => {
                    const vector = Object.values(v);
                    vector[2] = data.team.teamName//res.insertId;
                    return vector;
                });
                console.log(players)

                insertPlayers({ players: players, data: data, password: password });
            }
        });
        result.json(); // send ok
    },
    readTeam(request, response) {
        const authData = request.authData;
        if (debug) console.log("[" + time().join(':') + "][GET] user asking for teams...");
        const sql = `SELECT TEAM.TEAMNAME as teamName, TEAM.TRAINERNAME as trainerName, PLAYER.NAME as playerName, PLAYER.PNUMBER as playerNumber FROM PLAYER
        JOIN TEAM
        ON PLAYER.TEAMNAME = TEAM.TEAMNAME &&  (TEAM.USER = '${authData.user}'|| ${authData.role} = 11);` // where TEAM.EMAIL = username || userROLE == 'admin'
        db.query(sql, (err, data) => {
            if (err) console.log(err)
            else {
                response.json(JSON.stringify(data, authData));
            }
        })
    },
    deleteTeam(request, response) {
        request.json
        const teamName = request.params.teamName;
        const sql = `DELETE FROM PLAYER WHERE TEAMID=(SELECT TEAMID FROM TEAM WHERE TEAMNAME='${teamName}')`;
        const sql2 = `DELETE FROM TEAM WHERE TEAMNAME='${teamName}'`;
        const sql3 = `DELETE FROM MATCHINFO WHERE TEAMA='${teamName}' or TEAMB='${teamName}'`;
        const callback = (err, result) => {
            if (err) console.log(err);
            else if (debug) console.log(result.affectedRows);
        };
        db.query(sql, callback);
        db.query(sql2, callback);
        db.query(sql3, callback);
        response.send('ok');
    },

};
function insertPlayers(data) {
    const sql2 = 'INSERT INTO PLAYER (NAME, PNUMBER, TEAMNAME) VALUES ?'
    const players = data.players;
    db.query(sql2, [players], (err, result) => {
        if (err) console.log(err);
        else if (debug) console.log('[PLAYER] nbr data inserted : ...', result.affectedRows);
        const mail = {
            to: data.data.team.email,
            subject: '[theOcean-' + data.data.team.teamName + '] Inscription Réussi',
            message: `Bonjour,</p><br /><p>
                                    \tMerci d\'avoir choisi notre service. your Password :{${data.password}}</p><br /><p>
                                    </p><br /><p>Best Regards!
                                    </p><br /><p>theOcean Team`
        };
        sendMail(mail, (err, info) => {
            if (err) console.log(err)
            else if (debug) console.log('[Mail] sent to ...', info.response);
        });
    })
};