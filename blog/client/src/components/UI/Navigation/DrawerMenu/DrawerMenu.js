import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import ProfilePic from '../../../../assets/Avatar/undraw_male_avatar_blue.svg';
import ListItemLink from '../../ListItemLink/ListItemLink';
import customClasses from './DrawerMenu.css';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    drawerMenu: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(8)
    },
    drawerMenuProfile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content',
    },
    drawerMenuProfileAvatar: {
        width: 64,
        height: 64,
    },
    drawerMenuProfileName: {
        marginTop: theme.spacing(1)
    },
    drawerMenuDivider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
}));

const DrawerMenu = (props) => {
    const classes = useStyles();

    return (
        <div className={[classes.drawerMenu, customClasses.drawerMenu].join(' ')}>
            <div className={classes.toolbar}>
                <div className={classes.drawerMenuProfile}>
                    <Avatar alt="Picture" src={ProfilePic} className={classes.drawerMenuProfileAvatar} />
                    <Typography variant='subtitle1' className={classes.drawerMenuProfileName}>
                        Name
                    </Typography>
                    <Typography variant='body2'>
                        Occupation
                    </Typography>
                </div>
            </div>
            <Divider className={classes.drawerMenuDivider} />
            <List>
                {props.items.map((text) => (
                    <ListItemLink to={'/' + text.toLowerCase()} primary={text} key={text} />
                ))}
            </List>
        </div>
    );

}


DrawerMenu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default DrawerMenu;
