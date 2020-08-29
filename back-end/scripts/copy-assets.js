const ncp = require('ncp').ncp;
const fs = require('fs');

ncp.limit = 16;

console.log('Starting to copy assets');
const promises = [
    new Promise(res => {
        ncp('src/resources', 'dist/resources', function (err) {
            if (err) {
                return console.error(err);
            }
            res();
        });
    }),
    new Promise(res => {
        ncp('src/public', 'dist/public', function (err) {
            if (err) {
                return console.error(err);
            }
            res();
        });
    }),
    new Promise(res => {

        fs.readFile('ormconfig.json', 'utf8', (err, data) => {
            const newContent = data.replace(/dist\//g, '');
            fs.writeFile('dist/ormconfig.json', newContent, 'utf8', err => {
                if (err) {
                    return console.error(err);
                }
                res();
            });
        });
    })
];

Promise.all(promises).then(() => console.log('Done copying assets to dist'));
