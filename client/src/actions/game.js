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
  BEGIN_GAME,
  JOIN_GAME,
  LEAVE_GAME,
  GET_USER_SCORE
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

export const joinGame = id => async dispatch => {
  try {
    const res = await axios.put(`/api/game/join/${id}`);

    dispatch({ type: JOIN_GAME, payload: res.data });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const leaveGame = id => async dispatch => {
  try {
    const res = await axios.put(`/api/game/leave/${id}`);

    dispatch({ type: LEAVE_GAME, payload: res.data });
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
    console.log('playes: ' + res.data.players);

    dispatch({ type: LOAD_GAME_STATE, payload: res.data });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const beginGame = id => async dispatch => {
  try {
    // we would need to update the game state in the database

    const res = await axios.put(`/api/game/playing/${id}`);

    dispatch({ type: BEGIN_GAME, payload: res.data });
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

export const getPlayerScore = (gameId, playerId) => async dispatch => {
  try {
    const res = await axios.get(`/api/game/${gameId}/${playerId}`);

    console.log('from get score action: ' + res.data.score);

    return res.data.score;
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};

export const updatePlayerScore = (score, gameId) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const data = {
      score
    };

    const res = await axios.put(`/api/game/update/${gameId}`, data, config);

    dispatch({
      type: UPDATE_PLAYER_SCORE,
      payload: res.data.curQuestion.value
    });
  } catch (err) {
    dispatch({ type: GAME_ERROR });
  }
};
