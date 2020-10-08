module.exports = {
    run(io, data) {
        let viewCount = 0;
        let tid = -1;
        io.sockets.on('connection', (socket, username) => {
            console.log('\t...new client')
            viewCount++;

            const time = new Date().getTime();
            const still = data.time.getTime() - time;
            console.log('still : ', Math.ceil(still / 1000));
            /*
              console.log('...........now:  ', new Date().getHours(), ':', new Date().getMinutes());
              console.log('...........registred:  ', data.time.getHours(), ':', data.time.getMinutes());
            */

            socket.broadcast.emit('new_viewer', { viewCount: viewCount, nextMatch: parseInt(Math.ceil(still / 1000)) });
            if (tid == -1) {
                tid = setTimeout(() => {
                    socket.broadcast.emit('match', { match: data });
                    socket.emit('match', { match: data });
                    console.log('sending...')
                    clearTimeout(tid);
                    tid = -1;
                }, still);
            }
            // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
            /* socket.on('new_viewer', (username) => {
                 console.log('username:', username.username, '.........Views:', ++viewCount)
                 socket.broadcast.emit('new_viewer', { viewCount: viewCount });
             });
            */
            // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
            /*socket.on('message', function (message) {
                socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
            });*/
        });
    },
    setMatches() {
        let data;
        const sql = `SELECT TEAMA as A, TEAMB as B, MATCHTIME AS time FROM MATCHINFO order by MATCHTIME desc`;
        return new Promise((resolve, reject) => {

            db.query(sql, (err, res) => {
                if (err || res.length == 0) {
                    reject(err);
                } else {
                    data = { team: [res[0].A, res[0].B], time: res[0].time };
                    /*  const time = new Date().getTime();
                      const still = data.time.getTime() - time;
                      console.log('still : ', still / 1000 / 60);
                      console.log('...........now:  ', new Date().getHours(), ':', new Date().getMinutes());
                      console.log('...........registred:  ', data.time.getHours(), ':', data.time.getMinutes());
                     */ resolve(data);
                    /*
                     setTimeout(() => {
                         console.log('hey hhhh')
                     }, still);
                     */
                }
            });
        });
    }

}