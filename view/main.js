window.addEventListener("load", start);

function start() {

    data = {
        appId: 'root',
        page: {
            pages: [
                'Home', 'newTeam', 'Live'
            ],
            selected: 'Home', // newTeam or home
            hasChanged: false
        },
        // dataStructure for team, would be used to read from user.
        schema: {
            team: {
                teamName: '',
                trainerName: '',
                filledIn: false
            },
            player: {
                Name: '',
                role: '',
                number: '',
                filledIn: false
            },
            nPlayers: 11
        },
        hasChanged: {
            fillIn: false
        },
        team: [],
        selection: [
            null, null
        ],
        match: {}
    }
    actions.initAndGo(data);


}