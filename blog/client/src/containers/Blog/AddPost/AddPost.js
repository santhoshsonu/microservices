import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from '../../../components/Blog/posts-axios';

import { TextField, Typography, Button, CardMedia, Box, Container } from '@material-ui/core';

import classes from './AddPost.css';
import addPostImage from '../../../assets/Blog/addPost.svg';
import CustomizedSnackbar from '../../../components/UI/SnackBar/SnackBar';

import config from '../../../config/config';

class AddPost extends Component {
    state = {
        title: '',
        body: '',
        error: null,
        snackBarOpen: true,
    }

    handleTextFieldChange = (key, event) => {
        this.setState({ [key]: event.target.value });
    }

    postDataHandler = () => {
        const data = {
            title: this.state.title,
            content: this.state.body
        }
        axios.post(config.SERVICES.POSTS.ADD, data)
            .then(response => {
                if (response.status === 201) {
                    this.setState({ error: false, snackBarOpen: true });
                }
                else
                    this.setState({ error: true, snackBarOpen: true });
            })
            .catch(_ => {
                this.setState({ error: true, snackBarOpen: true });
                // console.log('[AddPost] API Error : ' + error)
            })
    }

    handleSnackBarClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackBarOpen: false });
    };

    render() {
        const errorSnackBar = (
            <CustomizedSnackbar
                severity='error'
                open={this.state.snackBarOpen}
                snackBarCloseHandler={this.handleSnackBarClose}>
                Failed to add the post.
            </CustomizedSnackbar>);

        const successSnackBar = (
            <CustomizedSnackbar
                severity='success'
                open={this.state.snackBarOpen}
                snackBarCloseHandler={this.handleSnackBarClose}>
                Successfully added the post.
            </CustomizedSnackbar>);

        return (
            <Container maxWidth='md'>
                <Box display='flex'>
                    <Box
                        padding={1}
                        display={{ xs: 'none', sm: 'none', md: 'flex' }}>
                        <CardMedia component='img' image={addPostImage} />
                    </Box>
                    <Box padding={1}>
                        <Typography className={classes.addPostTitle} align='center'>
                            ADD POST
                    </Typography>
                        <Box>
                            <TextField
                                id='post-title'
                                label="Title"
                                placeholder="Some title"
                                margin='normal'
                                variant='outlined'
                                value={this.state.title}
                                onChange={this.handleTextFieldChange.bind(this, 'title')}
                                fullWidth
                            />
                            <TextField
                                id='post-content'
                                label="Content"
                                placeholder="Some text..."
                                rows={2}
                                margin='normal'
                                variant='outlined'
                                fullWidth
                                multiline
                                value={this.state.body}
                                onChange={this.handleTextFieldChange.bind(this, 'body')}
                            />
                            <Button
                                className={classes.postSubmit}
                                type='submit'
                                variant='contained'
                                onClick={this.postDataHandler}>
                                Add Post
                        </Button>
                        </Box>
                        {this.state.error === null ? null : this.state.error ? errorSnackBar : successSnackBar}
                    </Box>
                </Box>
            </Container>
        );
    }
}

AddPost.propTypes = {
    url: PropTypes.string.isRequired,
}

export default AddPost;
