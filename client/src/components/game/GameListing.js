import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { joinGame, deleteGame } from '../../actions/game';

import Button from 'react-bootstrap/Button';

const GameListing = ({ game, id, joinGame, deleteGame }) => {
  const [listingState, setListingState] = useState({
    gameId: '',
    inGame: false
  });

  const joinRoom = (e, id) => {
    e.preventDefault();
    console.log('joining...');

    joinGame(id);

    setListingState({ ...listingState, gameId: id, inGame: true });
  };

  const deleteRoom = (e, id) => {
    e.preventDefault();

    deleteGame(id);
  };

  if (listingState.inGame) {
    return <Redirect to={`/play/${listingState.gameId}`} />;
  }

  return (
    <div key={game._id} className=' gameItem'>
      <h3>
        {game.roomName} - <span>Current Players: {game.players.length} </span>
      </h3>
      <div>
        {game.isPublic ? (
          <span>
            <i className='fas fa-unlock' /> Public
          </span>
        ) : (
          <span>
            <i className='fas fa-lock' /> Private
          </span>
        )}
        {id === game.owner ? (
          <Button className='btn-danger' onClick={e => deleteRoom(e, game._id)}>
            <i className='fas fa-minus-circle' />
          </Button>
        ) : null}
        <Button
          className='btn btn-success'
          onClick={e => joinRoom(e, game._id)}
        >
          Join Game
        </Button>
      </div>
    </div>
  );
};

GameListing.propTypes = {};

const mapStateToProps = state => ({
  id: state.auth.user._id
});

export default connect(
  mapStateToProps,
  { joinGame, deleteGame }
)(GameListing);
