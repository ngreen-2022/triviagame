import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import getProfiles from '../../actions/types';

function LeaderBoard() {
  const profiles = useSelector(state => state.GET_PROFILES); //useSelector (takes in state => state.ANYTHING IN THE APP THAT IS A STATE)
  const dispatch = useDispatch();                      //useDispatch() allows us to dispatch actions
  
  // <button onClick={() => dispatch(getProfiles())}>get profiles</button>
  return (
    <div className="LeaderBoard">
      <h1>LeaderBoard </h1>
      
      <ul>{profiles}</ul>
      
      
      
    </div>
  );
}

export default LeaderBoard;

