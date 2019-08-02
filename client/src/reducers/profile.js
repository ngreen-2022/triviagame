import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  BEGIN_PROFILE_ACTION
} from '../actions/types';

const initialState = {
  // Will make request and pull all profile data in this profile object
  profile: null,
  // Will be for the list of profiles
  profiles: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case BEGIN_PROFILE_ACTION:
      return{
        ...state,
<<<<<<< HEAD
        profile: null,
        loading: false
=======
        loading: true
>>>>>>> 33389d2b39cf458376506696ff4df15a358a30e9
      };
    default:
      return state;
  }
}
