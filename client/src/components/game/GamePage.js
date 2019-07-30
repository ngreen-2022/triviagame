import React, { useState, useEffect, Fragment } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PlayerList from './PlayerList';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
  updateCurrentQuestion,
  updatePlayerScore,
  loadGameState,
  beginGame,
  leaveGame
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
  loading,
  curQuestion,
  currentPlayers,
  updateCurrentQuestion,
  updatePlayerScore,
  loadGameState,
  beginGame,
  leaveGame,
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

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.emit('new_player_joining', gameId);
    console.log('client initial load');
    loadGameState(gameId);
    socket.emit('kill_socket', gameId);
  }, []);

  useEffect(() => {
    const socket = socketIOClient(endpoint);

    socket.emit('room', gameId);
    socket.on('give question', question => {
      updateCurrentQuestion(question);
    });
    socket.on('new_player_loaded', () => {
      loadGameState(gameId);
    });
    socket.on('start game', () => {
      setTimeout(() => {
        loadGameState(gameId);
      }, 1000);
    });
    socket.on('player_left', () => {
      setTimeout(() => {
        loadGameState(gameId);
      }, 1000);
    });
    // socket.on('give_scores', () => {
    //   loadGameState(gameId);
    // });
    // socket.on('give_scores', () => {
    //   console.log('received ping');
    //   loadGameState(gameId);
    // });
    return function cleanup() {
      socket.emit('kill_socket', gameId);
      // leaveGame(gameId);
    };
  }, [curQuestion]);

  const beginPlay = () => {
    beginGame(gameId);
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
      const socket = socketIOClient(endpoint);
      setGameState({ ...gameState, isCorrect: true });
      // dispatch action to update player score here
      updatePlayerScore(curQuestion.value, gameId);
      socket.emit('update_scores', gameId);
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
    leaveGame(gameId);
    socket.emit('leave_page', match.params.id);
  };

  return (
    <div className='game'>
      <Button className='game-buttons' onClick={beginPlay}>
        Begin playing
      </Button>
      <h2>{'isPlaying: ' + isPlaying}</h2>
      {isPlaying ? (
        <div className='get-question'>
          <Button
            className='game-buttons'
            onClick={getQuestion}
            disabled={isOn}
          >
            Get a question
          </Button>
          <p>Your current score: {playerScore}</p>
        </div>
      ) : (
        <h3>No one currently playing</h3>
      )}
      {curQuestion !== undefined && curQuestion !== null ? (
        <Fragment>
          <div>
            <h3 className='game-question'>
              Current Question: {curQuestion.question}
            </h3>
            <h3>Number of players: {currentPlayers.length} </h3>
            <Form className='game-answer' onSubmit={e => onSubmit(e)}>
              <Form.Group controlId='answer'>
                <Form.Control
                  type='text'
                  placeholder='Answer here...'
                  name='answer'
                  value={answer}
                  onChange={e => onChange(e)}
                />
              </Form.Group>
            </Form>
            {timer}
          </div>
          <LinkContainer to='/findgame'>
            <Button className='game-buttons' onClick={e => onLeave(e)}>
              Leave Game
            </Button>
          </LinkContainer>
          <PlayerList />
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
  curQuestion: state.game.curQuestion,
  currentPlayers: state.game.currentPlayers,
  loading: state.game.loading
});

export default connect(
  mapStateToProps,
  {
    updateCurrentQuestion,
    loadGameState,
    updatePlayerScore,
    beginGame,
    leaveGame
  }
)(GamePage);
