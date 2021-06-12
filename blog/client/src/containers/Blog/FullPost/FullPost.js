import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import config from "../../../config/config";
// import axios from '../../../components/Blog/posts-axios';
import '../../../library/font-library';
import { timeSince } from '../../../util/time-since';

import LoadingState from '../../../components/UI/Skeleton/FullPost/LoadingState';
import Alert from '../../../components/UI/Alert/Alert';
import { Container } from '@material-ui/core';
import CommentSection from '../Comments/Comments';

const fullPostError = (<Alert severity='error'> Oops! Something went wrong. </Alert>);
const fullPostUnavailable = (<Alert severity='warning'> Sorry, this post is unavailable. </Alert>);

const fullPostCard = (post) => {
    const timeAgo = `${timeSince(post.updatedAt)}  ago`;

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar aria-label="avatar">A</Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <FontAwesomeIcon icon='ellipsis-v' />
                    </IconButton>
                }
                title={post.title}
                subheader={timeAgo}
            />
            <CardContent>
                <Typography variant="body2" color="textPrimary" component="p">
                    {post.content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip TransitionComponent={Zoom} title="Like">
                    <IconButton aria-label="add to favorites">
                        <FontAwesomeIcon icon='heart' />
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title="Share">
                    <IconButton aria-label="share">
                        <FontAwesomeIcon icon='share' />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <CommentSection post_id={post.id} comments={post.comments} />
        </Card >
    )
};

class FullPost extends Component {

    state = {
        loadedPost: null,
        isLoading: false,
        error: false
    }

    componentDidMount() {
        this.setState({ loadedPost: { ...this.props } })
        /*
        this.axiosCancelSource = axios.CancelToken.source()
        try {
            const post_id = this.props.match.params.id;
            if (post_id) {
                if (!this.state.loadedPost || (this.state.loadedPost && this.state.loadedPost.id !== post_id)) {

                    this.setState({ error: false, isLoading: true }, () => {
                        axios.get(config.SERVICES.POSTS.GET_POST.replace(':pid', post_id), {
                            cancelToken: this.axiosCancelSource.token
                        }).then((response) => {
                            const post = response.data;
                            const options = { year: 'numeric', month: 'long', day: 'numeric' };
                            post.updatedAt = new Date(post.updatedAt).toLocaleString("en-US", options);
                            this.setState({ loadedPost: post, isLoading: false, error: false });
                        }).catch((error) => {
                            if (axios.isCancel(error)) {
                                console.log('[FullPost] API Cancel Error: ', error.message);
                            }
                            else {
                                this.setState({ error: true, isLoading: false });
                                console.log('[FullPost] API Error : ' + error)
                            }
                        }).then(() => {
                            console.log('Finished fetching post id : ' + post_id);
                        });
                    });

                }
            }
        }
        catch (err) {
            this.setState({ loadedPost: null, isLoading: false, error: true });
        }
        */

    }

    componentWillUnmount() {
        console.log('[FullPost] unmount')
        // this.axiosCancelSource.cancel('[FullPost] unmounted.')
    }

    render() {
        const loadedPost = this.state.loadedPost;

        return (
            <Container maxWidth='md'>
                {this.state.error ? fullPostError :
                    this.state.isLoading ? <LoadingState /> : (
                        <div>
                            {this.state.loadedPost ? fullPostCard(loadedPost) :
                                fullPostUnavailable}
                        </div>
                    )
                }
            </Container>
        );
    }
}

FullPost.propTypes = {
    post_id: PropTypes.string,
}

export default FullPost;