import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Leaderboards = ({ loading, profiles, getProfiles }) => {
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {profiles.map(profile => (
            <h2 key={profile.highScore}>{profile.highScore}</h2>
          ))}
        </div>
      )}
    </div>
  );
};

Leaderboards.propTypes = {};

const mapStateToProps = state => ({
  profiles: state.profile.profiles,
  loading: state.profile.loading
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Leaderboards);
