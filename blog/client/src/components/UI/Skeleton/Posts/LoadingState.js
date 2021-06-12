import React from 'react';

import { Grid } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';


const loadingState = () => (
    // <Skeleton variant="rect" width={210} height={118} />
    <Grid container
        alignItems='stretch'
        spacing={2}>
        {Array.from(new Array(4)).map((_, index) => (
            <Grid item md={3} sm={6} xs={12} key={index}>
                <Card style={{minHeight: 150}}>
                    <CardHeader
                        title={
                            <Skeleton animation="wave" height={10} />
                        }
                    />
                    <CardContent>
                        <Skeleton animation="wave" height={8} width="50%" />
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

export default loadingState;