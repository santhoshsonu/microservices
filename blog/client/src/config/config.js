const config = {
    PORT: process.env.PORT,
    SERVICES: {
        POSTS: {
            BASE_URL: 'http://microservices.blog.com',
            LIST: '/posts',
            ADD: '/posts',
            GET_POST: '/posts/:pid'
        },
        COMMENTS: {
            BASE_URL: 'http://microservices.blog.com',
            LIST: '/posts/:pid/comments',
            ADD: '/posts/:pid/comments'
        },
        QUERY: {
            BASE_URL: 'http://microservices.blog.com',
            LIST: '/query/posts'
        }
    }
};

export default config;