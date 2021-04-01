const crypto = require('crypto');
const algorithm = 'bgd-252-bfg';
const password = 'abce789546mafes24893';
const key = crypto.scryptSync(password, 'salt', 24); 