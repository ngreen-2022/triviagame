import axios from 'axios';
import {
  GET_GAMES,
  GET_GAME_BY_ID,
  CREATE_GAME,
  DELETE_GAME_BY_ID,
  GET_GAMES_ERROR,
  LOAD_GAME_STATE,
  UPDATE_CURRENT_QUESTION,
  UPDATE_PLAYER_SCORE,
  GAME_ERROR,
  BEGIN_GAME
} from './types';

export const createGame = data => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/game', data, config);

    dispatch({ type: CREATE_GAME, payload: res.data });

    loadGameState();
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const getGames = () => async dispatch => {
  try {
    const res = await axios.get('/api/game');

    dispatch({ type: GET_GAMES, payload: res.data });
  } catch (err) {
    dispatch({
      type: GET_GAMES_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const loadGameState = gameId => async dispatch => {
  try {
    const res = await axios.get(`/api/game/${gameId}`);

    console.log('response' + res.data.curQuestion);

    dispatch({ type: LOAD_GAME_STATE, payload: res.data });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const beginGame = () => dispatch => {
  try {
    // we would need to update the game state in the database
    dispatch({ type: BEGIN_GAME });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const updateCurrentQuestion = question => async dispatch => {
  try {
    // const res = await axios.put(`/api/game/${gameId}`);

    dispatch({ type: UPDATE_CURRENT_QUESTION, payload: question });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const updatePlayerScore = value => dispatch => {
  try {
    dispatch({ type: UPDATE_PLAYER_SCORE, payload: value });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};
