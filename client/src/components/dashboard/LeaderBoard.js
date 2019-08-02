import React, {useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getProfiles} from '../../actions/profile';
import Spinner from '../layout/Spinner';

function LeaderBoard() {
     
 const profiles = useSelector(state => state.profile.profiles); //useSelector (takes in state => state.ANYTHING IN THE APP THAT IS A STATE)
 const loading = useSelector(state => state.profile.profiles.loading);
 const dispatch = useDispatch();
 dispatch(getProfiles())

 
  return loading === true ? (
    <Spinner />
  ) : (
    <div className="LeaderBoard">
      <h1>LeaderBoard </h1>
      
      { console.log(JSON.parse(profiles.profiles.highScore.value)) }
      
    </div>
  );
}

export default LeaderBoard;

