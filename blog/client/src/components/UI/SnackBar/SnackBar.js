import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '../Alert/Alert';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const CustomizedSnackbar = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar autoHideDuration={3000} open={props.open} onClose={props.snackBarCloseHandler}>
                <Alert onClose={props.snackBarCloseHandler} severity={props.severity}>{props.children}</Alert>
            </Snackbar>
        </div>
    );
}

CustomizedSnackbar.propTypes = {
    snackBarCloseHandler: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

export default CustomizedSnackbar;
