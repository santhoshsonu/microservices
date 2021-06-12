import React, { Component } from 'react';
import PropTypes from 'prop-types';

import config from "../../../config/config";
import axios from '../../../components/Blog/comments-axios';

import LoadingState from '../../../components/UI/Skeleton/FullPost/LoadingState';
import Alert from '../../../components/UI/Alert/Alert';
import Comment from '../../../components/Blog/Comment/Comment';
import { Box, Button, CardContent, List, TextField, Typography } from '@material-ui/core';

const commentsUnavailable = (
    <div style={{ marginTop: '8px', padding: '0px 16px' }}>
        <Alert severity='warning'> No comments available. </Alert>
    </div>
);

const commentsLoadingState = (
    <div style={{ 'padding': '16px' }}>
        <LoadingState />
    </div>
);

const commentSection = (comments) => (
    <React.Fragment>
        {(comments && comments.length > 0) ? (<List>
            {comments.map(c => (<Comment key={c.id} {...c} />))}
        </List>) : commentsUnavailable}
    </React.Fragment>
);

class Comments extends Component {

    state = {
        comments: [],
        newComment: '',
        isLoading: false,
        error: false
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source()
        this.setState({ comments: this.props.comments });

        /*
        try {
            // const post_id = this.props.post_id;
            if (post_id) {
                if (!this.state.comments || this.state.comments.length === 0) {

                    this.setState({ error: false, isLoading: true }, () => {
                        axios.get(config.SERVICES.COMMENTS.LIST.replace(':pid', post_id), {
                            cancelToken: this.axiosCancelSource.token
                        }).then((response) => {
                            const comments = response.data;
                            this.setState({ comments: comments, isLoading: false, error: false });
                        }).catch((error) => {
                            if (axios.isCancel(error)) {
                                console.log('[Comments] API Cancel Error: ', error.message);
                            }
                            else {
                                this.setState({ error: true, isLoading: false });
                                console.log('[Comments] API Error : ' + error)
                            }
                        }).then(() => {
                            // console.log('Finished fetching post id : ' + post_id);
                        });
                    });

                }
            }
        }
        catch (err) {
            this.setState({ comments: null, isLoading: false, error: true });
        }
        */

    }

    componentWillUnmount() {
        console.log('[Comments] unmount')
        this.axiosCancelSource.cancel('[Comments] unmounted.')
    }

    handlerCommentChange = (event) => {
        this.setState({ newComment: event.target.value });
    }

    addCommentHandler = () => {
        try {
            const comment = { content: this.state.newComment };
            const post_id = this.props.post_id;
            if (post_id) {
                this.setState({ error: false, isLoading: true }, () => {
                    axios.post(config.SERVICES.COMMENTS.ADD.replace(':pid', post_id), comment, {
                        cancelToken: this.axiosCancelSource.token
                    }).then((response) => {
                        const updatedComments = [...this.state.comments];
                        updatedComments.splice(0, 0, response.data);
                        this.setState({ comments: updatedComments, isLoading: false, error: false });
                    }).catch((error) => {
                        if (axios.isCancel(error)) {
                            console.log('[Comments] API Cancel Error: ', error.message);
                        }
                        else {
                            this.setState({ isLoading: false, error: false });
                            console.log('[Comments] API Error : ' + error)
                        }
                    }).then(() => {
                        // console.log('Finished adding comment to post id : ' + post_id);
                        this.setState({ newComment: '' });
                    });
                });

            }
        }
        catch (err) {
            this.setState({ isLoading: false, error: true });
        }
    }

    render() {
        const comments = this.state.comments;

        const addCommentSection = (
            <Box
                p={2}
                display='flex'
                flexDirection="row"
                alignContent='center'
                alignItems="center"
                justifyContent='center'>
                <TextField
                    id='comment-content'
                    label="comment"
                    placeholder="Comment here..."
                    rows={2}
                    variant='outlined'
                    fullWidth
                    multiline
                    value={this.state.newComment}
                    onChange={this.handlerCommentChange}
                    style={{ marginRight: '8px' }}
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={this.addCommentHandler}>
                    Add
                </Button>
            </Box>
        );

        return (
            <CardContent style={{ paddingBottom: '16px' }}>
                <Typography variant='subtitle2'>Comments</Typography>
                {this.state.error ? commentsUnavailable :
                    this.state.isLoading ? commentsLoadingState : (
                        <div>
                            {this.state.comments ? commentSection(comments) :
                                commentsUnavailable}
                        </div>
                    )
                }
                {addCommentSection}
            </CardContent>
        );
    }
}

Comments.propTypes = {
    post_id: PropTypes.string,
}

export default Comments;