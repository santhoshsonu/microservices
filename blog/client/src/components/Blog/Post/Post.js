import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardActionArea } from '@material-ui/core';

import { timeSince } from '../../../util/time-since';

const Post = props => {
    let timeSpan = timeSince(props.updatedAt);

    return (
        <Card onClick={props.clicked} variant='outlined' style={{ width: '100%', height: '100%' }}>
            <CardActionArea style={{ height: '100%' }}>
                <CardContent>
                    <Typography color="textPrimary" gutterBottom>
                        {props.title}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                        {timeSpan + ' ago'}
                    </Typography>
                </CardContent>

            </CardActionArea>
        </Card>

    );
}

Post.propTypes = {
    id: PropTypes.number,
    userId: PropTypes.number,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    updatedAt: PropTypes.string.isRequired,
    clicked: PropTypes.func,
}

export default Post;