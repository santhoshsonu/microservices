import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";

import FullPost from '../FullPost/FullPost';
import { Grid } from '@material-ui/core';

class Posts extends Component {

    render() {
        // const match = this.props.match;

        return (
            <Grid container
                direction='column'
                spacing={2}>
                {this.props.posts.map(post => (
                    <Grid item md={12} sm={12} xs={12} key={post.id}>
                        <FullPost {...post} />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

Posts.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            userId: PropTypes.number,
            title: PropTypes.string.isRequired,
            body: PropTypes.string,
            updatedAt: PropTypes.string.isRequired,
            comments: PropTypes.array.isRequired
        })
    ).isRequired,
    clicked: PropTypes.func
}

export default Posts;
