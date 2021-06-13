require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    EVENT_BUS: process.env.EVENT_BUS
}
