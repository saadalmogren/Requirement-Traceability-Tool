import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Copyright from '../components/Copyright/Copyright';
import MainFeaturedPost from '../components/MainLanding/MainLanding';
import MainSystemFeatures from '../components/MainSystemFeatures/MainSystemFeatures';
import { Element} from 'react-scroll';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    root: {
        flexGrow: 1,
    },
    button: {
        margin: 10
    },
    image: {
        marginTop: 20
    },
    gridImage:{
        marginTop: 50
    }
}));

function LandingPage(props) {
    const classes = useStyles();

    let mainPageRedirect = null;
    if(props.isAuthenticated){
        mainPageRedirect = <Redirect to='/main-page'/>
      }

    return (
        <div>
            {mainPageRedirect}
            <Grid container className={classes.root}>

                <Grid item lg={2}>

                </Grid>
                <Grid item lg={8}>
    
                    <MainFeaturedPost />
                </Grid>
                <Grid item lg={2}>

                </Grid>
                <Grid item lg={2}>

                </Grid>
                <Grid item lg={8} className={classes.gridImage}>
                <Element name="test1" className="element">
                    <MainSystemFeatures />
                    </Element>
                </Grid>
                <Grid item lg={2}>

                </Grid>
                <Grid item lg={12}>
                    <Copyright />
                </Grid>

            </Grid>

        </div>
    );
}

const mapStateToProps = state => {
    return {
      loading: state.auth.loading,
      error: state.auth.error,
      isAuthenticated: state.auth.token !== null
    };
  };

  export default connect(
    mapStateToProps
  )(LandingPage);
