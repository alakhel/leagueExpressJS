export class Team {
    teamName: string;
    trainerName: string;
    user: string;

    constructor(team: { teamName: string, trainerName: string, user?: string }) {
        this.teamName = team.teamName;
        this.trainerName = team.trainerName;
        this.user = team.user || null;
    };
    private sql() {
        return `INSERT INTO TEAM (TEAMNAME, TRAINERNAME, USER) VALUES ` +
            `('${this.teamName}', '${this.trainerName}', '${this.user}')`;
    }
    save(db) {
        return new Promise((resolve, reject) => {
            db.query(this.sql(), (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
};

//
/**
 * @constructor(private name?:string, private lastname?: string);
 * @get Name(){return this.name} =>console.log(object.Name)
 * @set Name(value){this.name = value} => object.Name = 'lol'
 * @compile : tsc --target 'es5' main.ts && node main.js
 * @l
 *
 */

/*
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
    }*/
//export = Team;