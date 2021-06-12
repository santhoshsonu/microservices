require('dotenv').config();

module.exports = {
    port: process.env.port,
    EVENT_BUS: process.env.EVENT_BUS
}
