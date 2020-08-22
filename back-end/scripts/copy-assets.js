const ncp = require('ncp').ncp;

ncp.limit = 16;

console.log('Starting to copy assets');
ncp('src/resources', 'dist/resources', function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Done copying assets');
});
