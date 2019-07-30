import React from 'react';
import './App.css';

const Info = props => {
  return (
    <div className='info'>
      <h1>About Me</h1>
      <ul>
        <li>bio</li>
        <li>username</li>
        <li>email</li>
        <li>birthday</li>
        <li>facebook</li>
        <li>instagram</li>
      </ul>
      <button type='button'>Edit Profile</button>
    </div>
  );
};

export default Info;
