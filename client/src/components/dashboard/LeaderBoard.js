import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layout/Spinner';

function LeaderBoard() {
  const profiles = useSelector(state => state.profile.profiles); //useSelector (takes in state => state.ANYTHING IN THE APP THAT IS A STATE)
  const loading = useSelector(state => state.profile.loading);
  const dispatch = useDispatch();
  dispatch(getProfiles());

  return loading === true && profiles === null ? (
    <Spinner />
  ) : (
    <div className='LeaderBoard'>
      <h1>LeaderBoard </h1>

      {profiles.map(profile => (
        <div>
          <h2>{profile.highScore}</h2>
        </div>
      ))}
    </div>
  );
}

export default LeaderBoard;
