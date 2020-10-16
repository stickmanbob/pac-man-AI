import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import store from '../../redux/store';
import { initGame, initAutoGame, resetScore } from '../../redux/actions';

interface ControlProps {
  score?: number;
  iteration?: number;
  runningScore?: number;
  iterationsLeft?: number | undefined; 
}

const useStyles = makeStyles((theme: Theme) => ({
  score: {
    color: '#dd0',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(1)
  }
}));

const Controls: React.FC<ControlProps> = ({score, iteration,  runningScore, iterationsLeft}): JSX.Element => {
  
  const styles = useStyles({});

  const handleNewGame = ():void => {
    store.dispatch(initGame());
  };

  const handleAutogame = ():void => {
    store.dispatch(initAutoGame());
  };

  const handleResetScore = ():void => {
    store.dispatch(resetScore());
  };

  return (
    <>
      <div className={styles.score}>
        <Typography variant="body1">
          <b>Score:</b> 
          {' '}
          {score || 0}
        </Typography>
        <Typography variant="body1">
          <b>Total Score:</b> 
          {' '}
          {runningScore || 0}
        </Typography>
        <Typography variant="body1">
          <b>Iteration:</b> 
          {' '}
          {iteration || 1 }
        </Typography>
        <Typography variant="body1">
          <b>Iterations Remaining:</b>
          {' '}
          {iterationsLeft || 1}
        </Typography>
      </div>

      <Button onClick={handleNewGame} className={styles.button} fullWidth color="primary" variant="contained">New Game</Button>
      <Button onClick={handleAutogame} className={styles.button} fullWidth color="primary" variant="contained">Run 100 iterations</Button>
      <Button onClick={handleResetScore} className={styles.button} fullWidth variant="contained">Reset Score</Button>
    </>
  );
};

export default Controls;