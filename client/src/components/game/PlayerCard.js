import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlayerScore, loadGameState } from '../../actions/game';

const PlayerCard = ({
  currentPlayers,
  name,
  score,
  avatar,
  gameId,
  playerId,
  getPlayerScore,
  loadGameState,
  playerScore
}) => {
  const [cardState, setCardState] = useState({
    score: 0
  });
  useEffect(() => {
    loadGameState(gameId);
    console.log('remove this log');
    // setCardState({ ...cardState, score: scoreRes });
  }, [playerScore]);

  // useEffect(() => {
  //   loadGameState(gameId);
  // }, [playerScore]);
  return (
    <div className='card'>
      <div className='card-body'>
        <div className='card-title text-center'>{name}</div>
        <div className='card-text text-center'>Score: {score} </div>
      </div>
    </div>
  );
};

PlayerCard.propTypes = {};

const mapStateToProps = state => ({
  currentPlayers: state.game.currentPlayers,
  playerScore: state.game.playerScore,
  gameId: state.game.gameId
});

export default connect(
  mapStateToProps,
  { getPlayerScore, loadGameState }
)(PlayerCard);
