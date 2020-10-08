const view = {
    samDisplay(sectionId, representation) {
        const section = document.getElementById(sectionId);

        section.innerHTML = representation;
    },
    menu(model, state) {
        const pages = model.page.pages
        let loginbtn = model.loggedIn ? 'logout' : 'login';
        let loginaction = model.loggedIn ? 'actions.logout()' : "actions.changePage({page : 'Login'})";
        return `
        <nav class="menu">
          ${
            pages.map((v) => `<button  onclick="actions.changePage({page : '${v}'})">
              ${v == 'Home' ? `<i class="fas fa-home"></i>` : ''}
              ${v.includes('new') ? '<i class="fas fa-plus"></i>' : ''}
              ${v == 'Live' ? '<i class="fas fa-signal"></i>' : ''}
              ${v}
              </button>`).join('\n')
            }
            <button class="btn-login" onclick="${loginaction}">${loginbtn}</button>
        </nav>`
    },
    login() {

        return `
        <div class="loginPanel" >
            <form class="login" onsubmit="actions.logMe({e:event})">
                <input name="user" type="text" value="admin" /><br />
                <input name="pass" type="password" placeholde="password" /><br />
                <input class="submit" type="submit" value="Login" />
            </form>
        <div>`
    },
    home(model, state) {
        const menu = this.menu(model, state);
        const team = model.team;
        let match = '';
        if (model.match.team) match = this.match(model, state);
        return `
      ${menu}
      <div class="container">
        <h1>Dashboard</h1>
        ${
            team.map((v) => {
                return this.teamCard(v.teamName, v.trainerName);
            }).join('\n')
            }
        <br />
        ${match}
      </div>`
    },
    teamCard(teamName, trainerName = "", players = "") {
        return `
        <div id="teamCard">
            <!-- <span id="edit" onclick="actions.editTeam({teamName : '${teamName}', do :'edit'})">Edit</span><br />-->
            <span id="delete" onclick="actions.deleteTeam({teamName : '${teamName}', do :'delete'})">X</span><br />
            <h2>${teamName}</h2><br />
            <h4>     Trainer : ${trainerName}</h4><br />
            <img id="flag" src="/assets/${teamName}"/>
        </div>`
    },
    editTeam(teamName, trainerName = "", players = "") {
        return `
        <div id="teamCard">
          <p id="doneEdit" onclick="actions.editTeam({teamName : '${teamName}'})">Edit</p><br />
          <input id="teamEdit" value="${teamName}" />
          <h4>${trainerName}</h4><br />
          <img id="flag" src="/images/${teamName}"/>
        </div>`
    },

    newTeam(model, state) {
        const schema = model.schema;
        const menu = this.menu(model, state);
        const teamForm = this.teamFillIn(model, state);
        const playerForm = this.playersFillIn(model, state);
        let teamTable = ``;
        let playersTable = ``;


        if (schema.team.filledIn) {
            if (model.schema.nPlayers < 11) {
                model.team[model.team.length - 1].player.map((v) => {
                    playersTable += `
                              <tr>
                                <td>${
                        v.playerName
                        }</td>
                                <td>${
                        v.playerNumber
                        }</td>
                              </tr>
                              `
                });
            };

            teamTable = `
              <tr>
                <td>Team : ${
                model.team[model.team.length - 1].teamName
                }</td>
                <td>Trainer: ${
                model.team[model.team.length - 1].trainerName
                }</td>
              </tr>`
        }

        const currentForm = !schema.team.filledIn ? teamForm : (!schema.player.filledIn ? playerForm : '');
        return `
        ${menu}
        <div class="container tmForm">
            
            ${currentForm}
           
            <div id="teamCard">
                <table class="table" >
                    ${teamTable}
                    ${playersTable}
                </table>
            </div>
        </div>`
    },
    newMatch(model, state) {
        const menu = this.menu(model, state);
        if (model.team.length >= 2) teamA = model.team;
        else return `${menu}<br /><h6 style="position: absolute; top:15%">Please add 2 team at least</h6>`;
        console.log(model.selection)
        nTeams = teamA.length - 1;
        random1 = Math.ceil(Math.random() * nTeams);
        do {
            random2 = Math.ceil(Math.random() * nTeams);
        } while (random1 == random2);
        const selectedA = !model.selection[0] ? teamA[random1].teamName : model.selection[0];
        const selectedB = !model.selection[1] ? teamA[random2].teamName : model.selection[1];
        const time = new Date().toISOString().split('.')[0];
        return `${menu}
            <div class="match">
                <select onclick="actions.isSelectedInA({e:event, list: 'A'})" form="newMatch" name="teamA">
                ${
            teamA.map((v, i) => {
                const selected = selectedA == v.teamName ? "selected='selected'" : '';
                const disabled = selectedB == v.teamName ? "disabled='disabled'" : '';
                return `<option ${selected} ${disabled} >${
                    v.teamName
                    }</option>`
            })
            }
                </select>
                <select onclick="actions.isSelectedInA({e:event, list: 'B'})" form="newMatch" name="teamA">
                ${
            teamA.map((v, i) => {
                const selected = selectedB == v.teamName ? "selected='selected'" : '';
                const disabled = selectedA == v.teamName ? "disabled='disabled'" : '';
                return `<option ${selected} ${disabled} >${
                    v.teamName
                    }</option>`
            })
            }
                </select><br />
                <form name="newMatch" onsubmit="actions.newMatch({e: event})" >
                <input type="datetime-local" name="matchTime" value="${time}" min="${time}"/>
                <input type="submit" value="submit" />
                </form>
            </div>`
    },
    playersFillIn(model, state) {
        const done = model.schema.nPlayer == 0;
        const submit = done ? 'Soumettre' : 'Ajouter';
        return `
        <div class="">
            <form name="players" onsubmit="actions.playersFilledIn({e : event})">
                <input  id="pName" type="text" placeholder="player Name" required><br />
                <input  name="pNumber" id="pNumber" type="number" placeholder="number"/>
                Last one? <input  name="isLast" type="checkbox" /><br />
                <input  type="submit" value="${submit}"/>
            </form>
        </div>`
    },
    teamFillIn(model, state) {

        return `<div class="">
                  <form onsubmit="actions.teamFilledIn({e : event})">
                    <input name="teamName" type="text" placeholder="Team Name" required><br />
                    <input name="trainerName" type="text" placeholder="Trainer Name" required><br />
                    <input type="email" name="email" placeholder="username@example.com" required><br />
                    <input type="file" accept="image/*" name="logo" required><br />
                    <input type="submit" value="Ajouter" />
                  </form><br />
                </div>`
    },
    match(model, state) {
        const match = model.match;
        const time = match.time.split('T')
        return `
        <div id="teamCard">
            <h3>${
            match.team[0] + '\nVS\n' + match.team[1]
            }</h3>
            <br />
            <span>Le ${
            time[0].split('-').sort().join('/')
            }, à ${
            time[1].split(':').splice(0, 2).join(':')
            }</span>
        </div>`
    },
    live(model, state) {

        const menu = this.menu(model, state);
        const socket = io.connect('http://localhost:8080');

        socket.emit('new_viewer', { username: 'guestX2012' });
        socket.on('new_viewer', (data) => {
            console.log(data)
            const viewCount = document.getElementById('vnbr');
            const countDown = document.getElementById('countDown');
            viewCount.innerHTML = data.viewCount;
            const tid = setInterval(() => {
                countDown.innerHTML = `<h6>Next Match would start affter : ${Math.max(0, data.nextMatch)}s</h6>`
                if (data.nexMatch < 0) clearInterval(tid);
            }, 1000)
        });
        socket.on('match', (data) => {
            const container = document.getElementById('teamCard');
            console.log(data.match);
            container.innerHTML = `<h3>${data.match.team[0] + ' V S ' + data.match.team[1]}</h3>`
        })
        return `
            ${menu}
            <div class="live">
                <h1>Live : <span id="vnbr">0</span> views</h1>
                <h2 id="countDown"></h2>
                <div id="teamCard"></div>
            </div>`
    }
};