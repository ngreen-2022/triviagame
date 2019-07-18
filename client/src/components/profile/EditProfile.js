import React from 'react';
import './App.css';

const EditProfile = props => {
  return (
    <div className='editInfo'>
      <h1>About Me</h1>
      <form>
        Bio: <input type='text' name='bio' />
        <br />
        Username:
        <input type='text' name='username' />
        <br />
        Email:
        <input type='text' name='email' />
        <br />
        Birthday:
        <input type='text' name='birthday' />
        <br />
        Facebook:
        <input type='text' name='facebook' />
        <br />
        Instagram
        <input type='text' name='instagram' />
        <br />
      </form>
      <button type='submit' value='Submit'>
        Submit
      </button>
    </div>
  );
};

export default EditProfile;
