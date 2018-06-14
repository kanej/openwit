import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from './avatar'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  leftCol: {
      textAlign: 'right'
  }
});

function AutoGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Grid container justify='flex-end'>
            <Grid item className={classes.leftCol}>
                <Avatar person={props.feed.author}/>
                <h3>{props.feed.author.name}</h3>
                <h4>{props.feed.title}</h4>
            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={6}>

          {/* <Paper className={classes.paper}>xs=6</Paper> */}
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>xs</Paper>
        </Grid>
      </Grid>
    </div>
  );
}

AutoGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  feed: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoGrid);