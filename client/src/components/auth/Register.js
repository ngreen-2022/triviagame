import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// importing the setAlert action
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Register = ({ setAlert, register, isAuthenticated }) => {
  // This is a state hook, putting default values 'name' etc..
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  // Destructure
  const { name, email, password, password2 } = formData;

  // Will need 'onChange' handlers in input tags to accept incoming data
  // want setform() to only change the appropriate field, use spread operator to copy formData ...
  // then use [e.target.name] to grab the name attr of the field, use now for every field
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    // use prevent default on submit actions
    e.preventDefault();
    // check if passwords match
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      console.log('SUCCESS');
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='lg text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <Form onSubmit={e => onSubmit(e)}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </Form.Group>

        <Form.Group controlId='password2'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
          />
        </Form.Group>

        <Button type='submit'>Register</Button>
      </Form>
      <p className='mt-2 mb-2'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

// When using connect, has to be exported along with the component
// Connect will take in two things: 1: any state you want to pass, and on object with any actions to be used
// Allows use to access props.setAlert

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
