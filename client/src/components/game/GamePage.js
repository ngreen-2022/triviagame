import React, { useState, useEffect, Fragment } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PlayerList from './PlayerList';
import GameButtons from './GameButtons';
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

  const { endpoint, answer, gameId } = gameState;

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    socket.emit('new player', gameId);
    console.log('client initial load');
    // loadGameState(gameId);
    socket.emit('kill_socket', gameId);
  }, []);

  useEffect(() => {
    const socket = socketIOClient(endpoint);

    socket.emit('room', gameId);
    socket.on('give question', question => {
      updateCurrentQuestion(question);
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
    return function cleanup() {
      socket.emit('kill_socket', gameId);
    };
  }, []);

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

  return (
    <div className='game'>
      <div className='row'>
        {curQuestion !== undefined && curQuestion !== null ? (
          <Fragment>
            <div className='game-field col-md'>
              <h3 className='game-question'>
                Current Question: {curQuestion.question}
              </h3>
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
            </div>
          </Fragment>
        ) : (
          <h3>No current question</h3>
        )}
        <PlayerList gameId={gameId} />
      </div>
      <div className='row'>
        <div className='col-12'>
          <GameButtons gameId={gameId} />
        </div>
      </div>
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
