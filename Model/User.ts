export class User {
    constructor(private username: string, private password: string, private role?: number) {
        this.role = role || 10;
    }

    log() {
        console.log(`${this.password + ' ' + this.role + ' ' + this.username}`)
    };
    private sql() {
        return `INSERT INTO USERS (USERNAME, PASSWORD, ROLES) VALUES ` +
            `('${this.username}', '${this.password}', '${this.role}')`;
    }
    save(db) {
        return new Promise((resolve, reject) => {
            db.query(this.sql(), (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}