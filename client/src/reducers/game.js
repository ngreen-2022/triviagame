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
  GET_USER_SCORE,
  BEGIN_GAME_ACTION
} from '../actions/types';

const initialState = {
  gamesList: [],
  gameId: '',
  loading: true,
  // currentGame: null,
  currentPlayers: [],
  isPlaying: false,
  playerScore: 0,
  curQuestion: null,
  sendChange: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case BEGIN_GAME_ACTION:
      return { ...state, loading: true };
    case GET_GAMES:
      return { ...state, gamesList: payload, loading: false };
    case CREATE_GAME:
      return {
        ...state,
        gameId: payload._id,
        currentPlayers: payload.players,
        loading: true
      };
    case DELETE_GAME_BY_ID:
      return {
        ...state,
        gamesList: payload
      };
    case LOAD_GAME_STATE:
      return {
        ...state,
        gameId: payload._id,
        currentPlayers: payload.players,
        isPlaying: payload.isPlaying,
        curQuestion: payload.curQuestion,
        loading: false
      };
    case JOIN_GAME:
      return {
        ...state,
        gameId: payload._id,
        isPlaying: payload.isPlaying,
        curQuestion: payload.curQuestion,
        currentPlayers: payload.players,
        sendChange: !state.sendChange,
        loading: false
      };
    case LEAVE_GAME:
      return {
        ...state,
        gameId: '',
        isPlaying: false,
        curQuestion: null,
        currentPlayers: [],
        loading: false
      };
    case BEGIN_GAME:
      return { ...state, isPlaying: payload.isPlaying };
    case UPDATE_CURRENT_QUESTION:
      return {
        ...state,
        isPlaying: true,
        curQuestion: payload,
        loading: false
      };
    case UPDATE_PLAYER_SCORE:
      return {
        ...state,
        playerScore: state.playerScore + payload,
        sendChange: !state.sendChange
      };
    case GET_USER_SCORE:
      return { ...state, tempScore: payload };
    case GAME_ERROR:
      return { ...state };
    default:
      return state;
  }
}
