import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Timer = props => {
  const [timerState, setTimerState] = useState({
    timer: 0,
    start: 0,
    isOn: false
  });

  const { timer, start } = timerState;

  const startTimer = () => {
    setTimerState({ ...timerState, start: Date.now(), isOn: true });
    setInterval(
      () => setTimerState({ ...timerState, timer: Date.now() - start }),
      1000
    );
    console.log('Timer started...');
  };

  const resetTimer = () => {
    setTimerState({ ...timerState, timer: 0 });
  };

  return (
    <div>
      <h3>Timer: {timer}</h3>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={resetTimer}>Reset Timer</button>
    </div>
  );
};

Timer.propTypes = {};

export default Timer;
