module.exports = {
    newMatch(request, response) {
        const data = request.body;
        console.log(data);
        const sql = `INSERT INTO MATCHINFO (TEAMA, TEAMB, MATCHTIME) VALUES (
      '${data.team[0]}','${data.team[1]}','${data.time.replace('T', ' ')}')`;
        db.query(sql, (err, result) => {
            if (err) console.log(err)
            else console.log('[match]', result.affectedRows);
        })
        response.json()
    },
    readMatch(request, response) {
        console.log('[asking for  match]')
        const sql = `SELECT TEAMA as A, TEAMB as B, MATCHTIME AS time FROM MATCHINFO order by MATCHTIME desc`;
        db.query(sql, (err, res) => {
            if (err || res.length == 0) {
                console.log(err)
                response.sendStatus(204);
            } else {
                const data = { team: [res[0].A, res[0].B], time: res[0].time };

                response.json(JSON.stringify(data));
            }
        });
    },
}