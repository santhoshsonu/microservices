require('dotenv').config();

module.exports = {
    port: process.env.port,
    POSTS_SERVICE: process.env.POSTS_SERVICE,
    COMMENTS_SERVICE: process.env.COMMENTS_SERVICE,
    QUERY_SERVICE: process.env.QUERY_SERVICE
}
