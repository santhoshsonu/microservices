import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Container, Box } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

import config from '../../config/config';
import axios from '../../components/Blog/query-axios';

import PostsLoadingState from '../../components/UI/Skeleton/Posts/LoadingState';
import Posts from './Posts/Posts';

import '../../library/font-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Alert from '../../components/UI/Alert/Alert';
import Auxiliary from '../../hoc/Auxiliary';

const PostsError = (<Alert severity='error'> Oops! Something went wrong. </Alert>);

const AddPostFab = (props) => (
    <Box
        display='flex'
        justifyContent='flex-end' >
        <RouterLink
            to={props.url}
            style={{
                position: 'fixed',
                bottom: '4px'
            }} >
            <Fab color="secondary" aria-label="addPost" >
                <FontAwesomeIcon icon='plus' size='lg' />
            </Fab>
        </RouterLink>
    </Box>
);

class Blog extends Component {

    state = {
        posts: [],
        selectedPostId: null,
        error: false,
        isLoading: true
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source();
        // console.log('[Blog] mounted');
        axios.get(config.SERVICES.QUERY.LIST, {
            cancelToken: this.axiosCancelSource.token
        }).then(response => {
            const posts = response.data.slice(0, 28);
            this.setState({ posts: posts, isLoading: false, error: false });
        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log('[Blog] API Cancel Error: ', error.message);
            }
            else {
                this.setState({ error: true, isLoading: false });
                console.log(error);
            }
        }).then(() => {
            console.log('Finished fetching Posts');
        });
    }

    componentWillUnmount() {
        console.log('[Blog] unmount')
        this.axiosCancelSource.cancel('[Blog] unmounted.')
    }

    render() {
        // let match = this.props.match;
        const posts = this.state.posts;

        const POSTS = (this.state.error ? PostsError : this.state.isLoading ? <PostsLoadingState /> : (
            <Posts
                posts={posts}
                {...this.props} />
        ));

        return (
            <Auxiliary>
                <Container maxWidth='md'>
                    {POSTS}
                </Container >
                <AddPostFab url={`/post`} />
            </Auxiliary>
        );
    }
}

export default Blog;