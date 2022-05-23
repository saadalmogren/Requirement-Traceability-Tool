import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Feature from './Feature/Feature';
const useStyles = makeStyles({
    root: {
        marginTop: 10
    },
});
const featuresList = [
    {
        title: 'Traceability of requirement and related software artifacts'
    },
    {
        title: 'Attributes of requirements and traceability links'
    },
    {
        title: 'Visualization of traceability links'
    },
    {
        title: 'Access control'
    },
    {
        title: 'Import requirements using CSV'
    },
    {
        title: 'Export requirements traceability table as pdf'
    },
    {
        title: 'Handling change request'
    },
    {
        title: 'Version management'
    },
    {
        title: 'Database repository'
    },
    {
        title: 'Impact analysis'
    },
    {
        title: 'Easy to use'
    },
    {
        title: 'Web Based system'
    },
]
export default function Features() {
    const classes = useStyles();
    return (
        <Grid container spacing={3} className={classes.root}>

            {featuresList.map((feature) => {
                return (
                    <Grid item xs={6} key={feature.title}>
                        <Feature title={feature.title}/>
                    </Grid>
                );
            })}
        </Grid>
    );
}
