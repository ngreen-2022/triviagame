import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import socketIOClient from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import { beginGame, leaveGame } from '../../actions/game';

const GameButtons = ({ isPlaying, gameId, beginGame, leaveGame }) => {
  const [gameState, setGameState] = useState({
    endpoint: 'http://localhost:5000'
  });

  const { endpoint } = gameState;

  const beginPlay = () => {
    beginGame(gameId);
    const socket = socketIOClient(endpoint);
    socket.emit('begin game', gameId);
    socket.emit('kill_socket', gameId);
  };

  const onLeave = () => {
    const socket = socketIOClient(endpoint);
    leaveGame(gameId);
    socket.emit('leave_page', gameId);
  };

  const getQuestion = () => {
    const socket = socketIOClient(endpoint);
    socket.emit('get question', gameId);
    socket.emit('kill_socket', gameId);
  };

  return (
    <div>
      {!isPlaying ? (
        <Button onClick={beginPlay}>Begin playing</Button>
      ) : (
        <Fragment>
          {' '}
          <div className='col-4 '>
            <Button onClick={getQuestion}>Get a question</Button>
          </div>
          <LinkContainer to='/findgame'>
            <div className='col-4'>
              <Button onClick={e => onLeave(e)}>Leave Game</Button>
            </div>
          </LinkContainer>{' '}
        </Fragment>
      )}
    </div>
  );
};

GameButtons.propTypes = {};

const mapStateToProps = state => ({
  gameId: state.game.gameId,
  isPlaying: state.game.isPlaying
});

export default connect(
  mapStateToProps,
  { beginGame, leaveGame }
)(GameButtons);
