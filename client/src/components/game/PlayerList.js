import React, { useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import PropTypes from 'prop-types';
import { loadGameState } from '../../actions/game';
socketIOClient({ transports: ['websocket'] });

// Maybe unneccessary
socketIOClient.Manager('http://localhost:5000', {
  reconnection: false,
  reconnectionAttempts: 10
});

const PlayerList = ({
  currentPlayers,
  gameId,
  playerScore,
  sendChange,
  loadGameState
}) => {
  // useEffect(() => {
  //   loadGameState(gameId);
  //   console.log('curpl length: ' + currentPlayers.length);
  // }, []);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('room', gameId);
    socket.on('give_scores', () => {
      console.log('received ping');
      // loadGameState(gameId);
      setTimeout(() => {
        loadGameState(gameId);
      }, 1000);
    });
    return function cleanup() {
      socket.emit('kill_socket', gameId);
    };
  }, []);

  return (
    <div className='players'>
      {currentPlayers.map(player => (
        <PlayerCard
          key={player.playerId}
          playerId={player.playerId}
          name={player.playerName}
          score={player.score}
        />
      ))}
    </div>
  );
};

PlayerList.propTypes = {};

const mapStateToProps = state => ({
  playerScore: state.game.playerScore,
  currentPlayers: state.game.currentPlayers,
  gameId: state.game.gameId,
  sendChange: state.game.sendChange
});

export default connect(
  mapStateToProps,
  { loadGameState }
)(PlayerList);
