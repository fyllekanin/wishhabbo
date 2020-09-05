const mysql = require('mysql');

async function run() {
    return new Promise(resolve => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'wishhabbo'
        });

        connection.connect(async function (err) {
            if (err) throw err;

            connection.query('SET FOREIGN_KEY_CHECKS = 0;', (err, result) => {
                connection.query('SELECT table_name FROM information_schema.tables WHERE table_schema = ?', ['wishhabbo'], (err, result) => {
                    if (result.length === 0) {
                        resolve();
                        return;
                    }
                    const query = result.reduce((prev, curr, index) => {
                        console.log(curr);
                        const tableName = curr.table_name ? curr.table_name : curr;
                        return prev + (index > 0 ? `,${tableName}` : ` ${tableName}`);
                    }, 'DROP TABLE IF EXISTS');
                    connection.query(`${query};`, (err, result) => {
                        if (err) throw err;
                        resolve();
                    });
                });
            })
        });
    });
}

run().then(() => {
    console.log('Tables dropped');
    process.exit();
});
