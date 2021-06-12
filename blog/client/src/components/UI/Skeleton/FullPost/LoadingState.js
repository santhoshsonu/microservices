import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

const loadingState = () => (
    <Card style={{ width: '100%' }}>
        <CardHeader
            avatar={
                <Skeleton animation="wave" variant="circle" width={40} height={40} />
            }
            title={
                <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
            }
            subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <CardContent>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
        </CardContent>
    </Card>
);

export default loadingState;