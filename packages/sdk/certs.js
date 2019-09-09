const createCert = require('create-cert');

createCert().then(keys => console.log(keys));
