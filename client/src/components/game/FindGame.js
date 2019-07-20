import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGames } from '../../actions/game';

const FindGame = ({ gamesList, getGames }) => {
  useEffect(() => {
    getGames();
  }, []);
  return (
    <div>
      <h1>Find Game</h1>
      <div className='gameList'>
        {gamesList.map(game => (
          <div key={game._id} className='gameItem'>
            <h3>
              {game.roomName} -{' '}
              <span>Current Players: {game.players.length} </span>
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
              <button>Join Game</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

FindGame.propTypes = {};

const mapStateToProps = state => ({
  gamesList: state.game.gamesList
});

export default connect(
  mapStateToProps,
  { getGames }
)(FindGame);
