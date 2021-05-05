import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LoginForm from '../components/LoginForm';

const useStyles = makeStyles((theme) => ({
  style: {
    marginTop: '2rem',
  },
}));

export default function StudentLogin({ isLoggedIn, setIsLoggedIn }) {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center">
      <Typography variant="h4" className={classes.style}>
        Login
      </Typography>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </Grid>
  );
}
