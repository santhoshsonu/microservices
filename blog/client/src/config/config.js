const config = {
    PORT: process.env.PORT,
    SERVICES: {
        POSTS: {
            BASE_URL: 'http://localhost:3000',
            LIST: '/posts',
            ADD: '/posts',
            GET_POST: '/posts/:pid'
        },
        COMMENTS: {
            BASE_URL: 'http://localhost:3001',
            LIST: '/posts/:pid/comments',
            ADD: '/posts/:pid/comments'
        },
        QUERY: {
            BASE_URL: 'http://localhost:3002',
            LIST: '/query/posts'
        }
    }
};

export default config;