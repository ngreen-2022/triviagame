import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Timer from './Timer';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import {
  updateCurrentQuestion,
  updatePlayerScore,
  loadGameState,
  beginGame
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
  loadGameState,
  beginGame,
  match
}) => {
  const [gameState, setGameState] = useState({
    endpoint: 'http://localhost:5000',
    // isPlaying: false,
    // curQuestion: []
    answer: '',
    isCorrect: null,
    isDisabled: false,
    gameId: match.params.id
  });

  const [timerState, setTimerState] = useState({
    timer: 0,
    isOn: false,
    timerMsg: ''
  });

  const { endpoint, answer, gameId } = gameState;

  const { timer, isOn } = timerState;

  // Runs when gamepage first loads
  // useEffect(() => {
  //   const socket = socketIOClient(endpoint);
  //   socket.on('start game', () => {
  //     // setGameState({ ...gameState, isPlaying: true });
  //     loadGameState(gameId);
  //   });
  // });

  useEffect(() => {
    loadGameState(gameId);
  }, []);

  // put gameid back on emit calls

  // useEffect(() => {
  //   // const socket = socketIOClient(endpoint);
  //   socket.on('connect', () => {
  //     // loadGameState(match.params.id);
  //     socket.emit('room', match.params.id);
  //     console.log('connected to room' + match.params.id);
  //   });
  // }, []);

  // This works

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    // socket.on('connect', () => {
    //   socket.emit('room', gameId);
    // });
    socket.emit('room', gameId);
    socket.on('give question', question => {
      updateCurrentQuestion(question);
    });
    // socket.emit('kill_socket', gameId);
    return function cleanup() {
      socket.emit('kill_socket', gameId);
    };

    // THIS IS THE BUG
  }, [curQuestion]);

  const beginPlay = () => {
    // setPlaying(true);
    beginGame();
    const socket = socketIOClient(endpoint);
    socket.emit('begin game', gameId);
    socket.emit('kill_socket', gameId);
  };

  const beginTimer = () => {
    const start = Date.now();
    const tStart = setInterval(() => {
      const timer = Date.now() - start;
      setTimerState({
        ...timerState,
        isOn: true,
        timer
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(tStart);
      setTimerState({ ...timerState, isOn: false, timer: 0 });
    }, 30000);
  };

  const getQuestion = () => {
    const socket = socketIOClient(endpoint);
    beginTimer();

    console.log(curQuestion);

    socket.emit('get question', gameId);
    socket.emit('kill_socket', gameId);
  };

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

  const onLeave = () => {
    const socket = socketIOClient(endpoint);
    socket.emit('leave_page', match.params.id);
  };

  return (
    <div>
      <button onClick={beginPlay}>Begin playing</button>
      <h2>{'isPlaying: ' + isPlaying}</h2>
      {isPlaying ? (
        <div className='currentGame'>
          <button onClick={getQuestion} disabled={isOn}>
            Click to get a question
          </button>
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
          {timer}
          <Button className='btn btn-primary' onClick={onLeave}>
            {' '}
            <Link to='/findgame'>Leave Game</Link>
          </Button>
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
  { updateCurrentQuestion, loadGameState, updatePlayerScore, beginGame }
)(GamePage);
