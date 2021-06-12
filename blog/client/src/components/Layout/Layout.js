import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '../UI/AppBar/AppBar';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: '100%',
        backgroundColor: '#f4f6f8'
    },
}));

const Layout = (props) => {
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            {/* APP BAR */}
            <AppBar toggleDrawer={handleDrawerToggle} title={props.title} />
            <Container className={classes.content} maxWidth={false} disableGutters>
                <div className={classes.toolbar} />
                {props.children}
            </Container>
        </div>
    );
}

export default Layout;