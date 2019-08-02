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
  className,
  playerScore,
  sendChange,
  loadGameState
}) => {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('room', gameId);
    socket.on('player load', () => {
      setTimeout(() => {
        loadGameState(gameId);
      }, 1000);
    });
    return function cleanup() {
      socket.emit('kill_socket', gameId);
      console.log('function dead');
    };
  }, []);

  return (
    <div className='player-list'>
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
  sendChange: state.game.sendChange
});

export default connect(
  mapStateToProps,
  { loadGameState }
)(PlayerList);
