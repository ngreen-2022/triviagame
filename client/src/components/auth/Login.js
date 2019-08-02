import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = ({ login, isAuthenticated }) => {
  // This is a state hook, putting default values 'name' etc..
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Destructure
  const { email, password } = formData;
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    // use prevent default on submit actions
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Sign Into Your Account
      </p>
      <Form onSubmit={e => onSubmit(e)}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </Form.Group>

        <Button type='submit' className='btn-primary'>
          Submit
        </Button>
      </Form>
      <p className='mt-2 mb-2'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
