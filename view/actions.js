const actions = {
    initAndGo(data) {
        model.samPresent({
            do: 'initAndGo',
            config: data
        });
    },
    isSelectedInA(data) {
        console.log(data.e.target.value)
        model.samPresent({ do: 'matchSelectTeam', team: data.e.target.value, list: data.list })
    },
    async logMe(data) {
        const app = document.getElementById('root')
        const form = data.e.target;
        data.e.preventDefault();
        const formData = JSON.stringify({ user: form.user.value, password: form.pass.value });
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData
        };
        await fetch('/logMe', options)
            .then(async (response) => {
                console.log(response)
                if (response.ok) {
                    enveloppe = await response.json();
                    model.samPresent({ do: 'login', pages: enveloppe.pages });
                } else app.innerHTML += `<h4>Password/Team incorrect!</h4>`
            });
    },
    logout() {
        model.samPresent({ do: 'logout' });
    },
    changePage(data) {
        console.log('actions: changing page ', data.page)
        model.samPresent({ do: 'changePage', page: data.page });
    },
    teamFilledIn(data) {
        const form = data.e.target;
        const email = form.email.value;
        console.log(form.email.value);
        const trainerName = form.trainerName.value;
        const teamName = form.teamName.value;
        const logo = form.logo.files[0];
        const team = {
            teamName: teamName,
            trainerName: trainerName,
            logo: logo,
            email: email
        };
        model.samPresent({
            do: 'teamFilledIn',
            team: team
        });
    },
    playersFilledIn(data) {
        const form = data.e.target
        const isLast = form.isLast.checked;
        const pName = form.pName.value;
        const pNumber = parseInt(form.pNumber.value);
        const player = {
            playerName: pName,
            playerNumber: pNumber ? pNumber : 0
        };
        model.samPresent({
            do: 'playersFilledIn',
            player: player,
            done: isLast
        });
    },
    editTeam(data) {
        console.log(data);
    },
    deleteTeam(data) {
        model.samPresent({ do: 'deleteTeam', teamName: data.teamName });
    },
    newMatch(data) {
        const matchTime = data.e.target.matchTime.value;
        model.samPresent({ do: 'newMatch', matchTime: matchTime })
    },
    view() {
        const a = document.querySelector('.fas');
        a.addEventListener('mouseover', () => {
            const root = document.getElementById('root')
            root.style = "opacity:20%"
            console.log('mouse')
            let x = 20;


            const id = setInterval(() => {
                x = x + 10;
                root.style = `opacity:${x}%`;
                console.log(root.style.opacity)
                if (x == 100) clearInterval(id);
            }, 1000);
        })
    }
};