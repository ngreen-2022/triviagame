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
} from '../actions/types';

const initialState = {
  gamesList: [],
  isPlaying: false,
  playerScore: 0,
  curQuestion: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GAMES:
      return { ...state, gamesList: payload };
    case LOAD_GAME_STATE:
      return { ...state, isPlaying: true };
    case UPDATE_CURRENT_QUESTION:
      return { ...state, isPlaying: true, curQuestion: payload };
    case UPDATE_PLAYER_SCORE:
      return { ...state, playerScore: state.playerScore + payload };
    case GAME_ERROR:
      return { ...state };
    default:
      return state;
  }
}
