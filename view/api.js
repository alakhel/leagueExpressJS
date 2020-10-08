// ______________________________________________________________________Utils
const utils = {
    addTeam_(_data) {
        const data = JSON.stringify(_data);
        let formData = new FormData();
        if (_data.team.logo)
            formData.append('logo', _data.team.logo, 'temp1.jpg');

        formData.append('team', data);

        const options = {
            method: 'POST',
            headers: {
                Accept: 'multipart/form-data'
            },
            body: formData
        };
        fetch('/addTeam_', options).then((response) => {
            console.log(response.ok ? '[success]' : '[failed]');
        });
    },
    addTeam(data) {
        const body = JSON.stringify(data);
        const options = {
            method: 'POST', headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: body
        };
        fetch('/addTeam', options)
            .then((response) => console.log(response));
    },
    readTeam() {
        return fetch('/readTeam', {
            method: 'GET',
        }).then((response) => response.json()).then((response) => JSON.parse(response));
    },
    deleteTeam(data) {
        fetch('/delete/' + data.teamName, {
            methode: 'delete',
        }).then((res) => {
            console.log(res)
        });
    },
    newMatch(data) {
        const body = JSON.stringify(data);
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json'
            },
            body: body
        };
        fetch('/newMatch', options).then((response) => console.log(response))
    },
    readMatch() {
        return fetch('/readMatch')
            .then((res) => res.status == 204 ? null : res.json())
            .then((data) => data ? data : JSON.parse(data));
    },

}
