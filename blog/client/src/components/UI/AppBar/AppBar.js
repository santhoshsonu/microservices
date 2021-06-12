import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../library/font-library'
import { Box } from '@material-ui/core';

// import { DRAWERWIDTH } from '../Navigation/Navigation';

const useStyles = makeStyles(theme => ({
    appBar: {
        // [theme.breakpoints.up('sm')]: {
        //     width: `calc(100% - ${DRAWERWIDTH}px)`,
        //     marginLeft: DRAWERWIDTH,
        // },
        zIndex: 1250,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    brandLogo: {
        marginRight: theme.spacing(1),
        color: '#F9A826'
    }
}));


const ApplicationBar = (props) => {
    const classes = useStyles();
    return (
        <AppBar position="fixed" elevation={0} className={classes.appBar}>
            <Toolbar variant="regular">
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.toggleDrawer}
                    className={classes.menuButton}>
                    <FontAwesomeIcon icon='bars' />
                </IconButton>
                <Box display='flex' alignItems='center'>
                    <FontAwesomeIcon icon='hamburger' size='3x' className={classes.brandLogo} />
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

ApplicationBar.propTypes = {
    title: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired
}

export default ApplicationBar;