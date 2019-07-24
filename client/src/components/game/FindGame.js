import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
// Actions
import { getGames, createGame, loadGameState } from '../../actions/game';
// Bootstrap
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const FindGame = ({ gamesList, gameId, loading, getGames, createGame }) => {
  const [findState, setFindState] = useState({
    modalState: false,
    roomName: '',
    isPublic: true
  });

  const { modalState, roomName, isPublic } = findState;

  const handleClose = () => setFindState({ ...findState, modalState: false });
  const handleShow = () => setFindState({ ...findState, modalState: true });

  const onChange = e =>
    setFindState({ ...findState, [e.target.name]: e.target.value });

  const onCheckChange = () =>
    setFindState({ ...findState, isPublic: !isPublic });

  useEffect(() => {
    getGames();
  }, []);

  const onCreateGame = e => {
    e.preventDefault();

    const data = { roomName, isPublic };

    handleClose();

    // need create game action
    createGame(data);
    getGames();
  };

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
              <Link
                className='btn btn-success'
                to={{
                  pathname: `/play/${game._id}`
                }}
              >
                <span className='text-center'>Join Game</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <>
        <Button variant='success' onClick={handleShow}>
          Create Game
        </Button>

        <Modal show={modalState} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Creating Game</Modal.Title>
          </Modal.Header>

          <Form>
            <Form.Group controlId='formGameName'>
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter room name'
                name='roomName'
                value={roomName}
                onChange={e => onChange(e)}
              />
            </Form.Group>

            <Form.Group controlId='formIsPublic'>
              <Form.Check
                type='checkbox'
                label='Make Private'
                onClick={onCheckChange}
              />
            </Form.Group>
          </Form>

          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='success' onClick={e => onCreateGame(e)}>
              Create Game
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

FindGame.propTypes = {};

const mapStateToProps = state => ({
  gamesList: state.game.gamesList,
  gameId: state.game.gameId,
  loading: state.game.loading
});

export default connect(
  mapStateToProps,
  { getGames, createGame }
)(FindGame);
