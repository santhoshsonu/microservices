import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CardMedia, Box, Typography } from '@material-ui/core';

import page_not_found from '../../../assets/Error/404.svg';

const error = (props) => (
    <Box
        m={2}
        padding={2}
        textAlign='center'>
        <CardMedia
            alt='Page Not Found'
            component='img'
            src={page_not_found}
            height={450}
            style={{ objectFit: 'contain' }} />
        <Box mt={2}>
            <Typography color='textSecondary'>
                Sorry, this page is not available.
                <RouterLink to='/' style={{ textDecoration: 'none' }}> Go back to Home.</RouterLink>
            </Typography>
        </Box>
    </Box>
);

export default error;
