import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Copyright from '../components/Copyright/Copyright';
import Features from '../components/Features/Features';
import Imagg from '../assets/GraphicsViewer.png';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    root: {
        flexGrow: 1,
    },
    image: {
        margin: 20
    }
}));

export default function SystemFeatures(props) {
    const classes = useStyles();

    return (
        <div>
            <Grid container className={classes.root}>
                <Grid item lg={2}>
                </Grid>
                <Grid item lg={8}>
                    <img src={Imagg} width={1000} height={500} className={classes.image} alt={'RTT'} />
                    <Features />
                </Grid>
                <Grid item lg={2}>
                </Grid>
            </Grid>
            <Copyright />
        </div>





    );
}

