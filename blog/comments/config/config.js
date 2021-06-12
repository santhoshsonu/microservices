require('dotenv').config();

module.exports = {
    mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@dbcluster-fxveo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    port: process.env.port,
    EVENT_BUS: process.env.EVENT_BUS
}
