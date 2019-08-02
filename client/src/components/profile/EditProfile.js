import React, { useEffect, Fragment } from 'react';
import { Button, Form } from 'react-bootstrap';

import {
  getCurrentProfile,
  deleteAccount,
  createProfile
} from '../../actions/profile';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import '../../App.css';

const EditProfile = ({
  getCurrentProfile,
  createProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return (
    <Fragment>
      <div>
        <Form>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='text' placeholder='Enter email' />
            <Form.Text className='text-muted' />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='text' placeholder='Password' />
          </Form.Group>

          <Button variant='primary' type='submit'>
            Save
          </Button>
        </Form>
      </div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile, deleteAccount }
)(EditProfile);
