import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import Timer from './Timer';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import {
  updateCurrentQuestion,
  updatePlayerScore,
  loadGameState
} from '../../actions/game';
socketIOClient({ transports: ['websocket'] });

// Maybe unneccessary
socketIOClient.Manager('http://localhost:5000', {
  reconnection: false,
  reconnectionAttempts: 10
});

const GamePage = ({
  isPlaying,
  playerScore,
  curQuestion,
  updateCurrentQuestion,
  updatePlayerScore,
  loadGameState
}) => {
  const [gameState, setGameState] = useState({
    endpoint: 'http://localhost:5000',
    // isPlaying: false,
    // curQuestion: []
    answer: '',
    isCorrect: null
  });

  const { endpoint, answer, isCorrect } = gameState;

  const beginPlay = () => {
    // setPlaying(true);
    const socket = socketIOClient(endpoint);
    socket.emit('begin game', true);
  };

  const getQuestion = () => {
    const socket = socketIOClient(endpoint);
    socket.emit('get question');
    console.log(curQuestion);
  };

  // Runs when gamepage first loads
  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on('begin game', isPlaying => {
      //   setGameState({ ...gameState, isPlaying });
      loadGameState();
    });
  }, []);

  // Runs continually to check question status
  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.on('get question', question => {
      console.log(question);
      //   setGameState({ ...gameState, isPlaying: true, curQuestion: question });
      updateCurrentQuestion(question);
    });
  }, []);

  const onSubmit = e => {
    // call action here to register answer
    // we will need to check the answer, can probably do that here
    e.preventDefault();
    if (answer === curQuestion.answer) {
      setGameState({ ...gameState, isCorrect: true });
      // dispatch action to update player score here
      console.log(curQuestion.value);
      updatePlayerScore(curQuestion.value);
      console.log('Correct');
    } else {
      setGameState({ ...gameState, isCorrect: false });
      console.log('Wrong!');
    }
  };

  const onChange = e =>
    setGameState({ ...gameState, [e.target.name]: e.target.value });

  return (
    <div>
      <button onClick={beginPlay}>Begin playing</button>
      <h2>{'isPlaying: ' + isPlaying}</h2>
      {isPlaying ? (
        <div className='currentGame'>
          <button onClick={getQuestion}>Click to get a question</button>
          <p>Your current score: {playerScore}</p>
        </div>
      ) : (
        <h3>No one currently playing</h3>
      )}
      {curQuestion !== undefined ? (
        <Fragment>
          <h3>Current Question: {curQuestion.question}</h3>
          <form onSubmit={e => onSubmit(e)}>
            <input
              type='text'
              placeholder='Answer here...'
              name='answer'
              value={answer}
              onChange={e => onChange(e)}
            />
          </form>
        </Fragment>
      ) : (
        <h3>No current question</h3>
      )}
    </div>
  );
};

GamePage.propTypes = {};

const mapStateToProps = state => ({
  isPlaying: state.game.isPlaying,
  playerScore: state.game.playerScore,
  curQuestion: state.game.curQuestion
});

export default connect(
  mapStateToProps,
  { updateCurrentQuestion, loadGameState, updatePlayerScore }
)(GamePage);
