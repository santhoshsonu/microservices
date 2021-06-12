import React from 'react';
import PropTypes from 'prop-types';

import MuiAlert from '@material-ui/lab/Alert';

const alert = (props) => (
    <MuiAlert elevation={1} variant="filled" {...props} />
);

alert.propTypes = {
    severity: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
}

export default alert;