import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Imagg from '../../assets/blue.png';
import Features from '../Features/Features';

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      
    },
  },
}));

export default function MainFeaturedPost(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${Imagg})` }}>
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={Imagg} alt="RTT2" />}
      <div className={classes.overlay} id='features'/>
      <Grid container>
        <Grid item md={12}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h1" variant="h3" color="primary" gutterBottom>
              System Features
            </Typography>
            <Features />
          </div>
        </Grid>

      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.object,
};