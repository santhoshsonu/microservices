import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';

import { timeSince } from '../../../util/time-since';

const Comment = props => {
    const timeSpan = timeSince(props.updatedAt);
    const status = props.status || 'approved';
    const content = status === 'approved' ? props.content : (status === 'rejected') ? (<em>This comment is moderated</em>) : (<em>This comment is awaiting moderation</em>);
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="avatar">A</Avatar>
            </ListItemAvatar>
            <ListItemText>
                <Typography variant='body2'>{content}</Typography>
                <Typography variant='caption' color='textSecondary'>{timeSpan + ' ago'}</Typography>
            </ListItemText>
        </ListItem>
    );
}

Comment.propTypes = {
    id: PropTypes.string,
    content: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
}

export default Comment;