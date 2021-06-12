import React from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import DrawerMenu from './DrawerMenu/DrawerMenu';

export const DRAWERWIDTH = 225;

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: DRAWERWIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: DRAWERWIDTH,
    }
}));

const Navigation = props => {
    const theme = useTheme();
    const classes = useStyles();
    const items = ['Builder', 'Orders', 'Blog'];

    return (
        <nav className={classes.drawer} aria-label="burger builder">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={props.mobileOpen}
                    onClose={props.toggleDrawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <DrawerMenu items={items} />
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open>
                    <DrawerMenu items={items} />
                </Drawer>
            </Hidden>
        </nav>
    );
}

Navigation.propTypes = {
    mobileOpen: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired
}

export default Navigation;