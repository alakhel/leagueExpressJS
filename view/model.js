const model = {
    async samPresent(data) {
        switch (data.do) {
            case 'initAndGo':
                Object.assign(this, data.config);
                const match1 = await utils.readMatch();
                if (match1) this.match = match1;
                this.loggedIn = localStorage.getItem("loggedIn");
                if (this.loggedIn) {
                    console.log('loggedIn', localStorage.getItem("pages").split(','));
                    model.page.pages = localStorage.getItem("pages").split(',')
                };
                break;
            case 'login':
                localStorage.setItem("pages", data.pages)
                localStorage.setItem("loggedIn", true)
                model.page.pages = data.pages;
                this.loggedIn = true;
                this.page.selected = 'Home';
                this.team = await utils.readTeam();
                const match = await utils.readMatch();
                if (match) this.match = match;
                console.log(this)
                break;
            case 'logout':
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('pages');
                this.loggedIn = false;
                start();
                break;
            case 'changePage':
                console.log('changin...')
                console.log('===>', this)
                if (this.schema.nPlayers == 0) {
                    this.schema.nPlayers = 11;
                    this.schema.player.filledIn = false;
                    this.schema.team.filledIn = false;
                }
                if (data.page == 'Home') {
                    console.log('hey hey')
                    const match2 = await utils.readMatch();
                    if (match2) this.match = match2;
                    if (model.loggedIn) this.team = await utils.readTeam();
                }

                this.page.selected = data.page;
                break;
            case 'matchSelectTeam':
                this.selection[data.list == 'A' ? 0 : 1] = data.team;
                break;
            case 'teamFilledIn':
                this.team.push(data.team);
                this.team[this.team.length - 1].player = new Array();
                this.schema.team.filledIn = true;
                this.hasChanged.fillIn = true;
                console.log(this);
                break;
            case 'playersFilledIn':
                const nTeam = this.team.length;
                this.team[nTeam - 1].player[11 - this.schema.nPlayers] = Object.assign(data.player, { nteam: this.team.length });
                if (this.schema.nPlayers == 1 || data.done) {
                    this.schema.nPlayers = 1;
                    this.page.selected = 'Home'
                    this.schema.player.filledIn = true;
                    utils.addTeam(this.team[nTeam - 1]);
                    //utils.addTeam_({ nTeam: nTeam, team: this.team[nTeam - 1] });
                }
                this.hasChanged.fillIn = true;
                this.schema.nPlayers--;
                console.log(this)
                break;
            case 'deleteTeam':
                this.team.map((v, i) => {
                    if (v.teamName == data.teamName) {
                        delete this.team[i];
                        console.log('done')
                    }
                })
                utils.deleteTeam({ teamName: data.teamName });
                break;
            case 'newMatch':

                console.log('match', data.matchTime);
                teamA = model.team;
                nTeams = teamA.length - 1;
                random1 = Math.ceil(Math.random() * nTeams);
                do {
                    random2 = Math.ceil(Math.random() * nTeams);
                } while (random1 == random2);
                const selectedA = !model.selection[0] ? teamA[random1].teamName : this.selection[0];
                const selectedB = !model.selection[1] ? teamA[random2].teamName : this.selection[1];
                this.match.team = [selectedA, selectedB];
                this.match.time = data.matchTime;
                console.log(this.match)
                utils.newMatch(this.match);
                break;
            default:
        }
        state.samUpdate(this);
    },
};