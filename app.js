console.clear();
require('dotenv').config();
const Server = require('./src/model/server.js');

const server = new Server();
server.listen();