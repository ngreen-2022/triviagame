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
  GAME_ERROR
} from './types';

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

export const loadGameState = () => dispatch => {
  try {
    dispatch({ type: LOAD_GAME_STATE });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const updateCurrentQuestion = question => dispatch => {
  try {
    dispatch({ type: UPDATE_CURRENT_QUESTION, payload: question[0] });
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
