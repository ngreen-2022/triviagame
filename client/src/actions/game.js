import {
  LOAD_GAME_STATE,
  UPDATE_CURRENT_QUESTION,
  UPDATE_PLAYER_SCORE,
  GAME_ERROR
} from './types';

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
