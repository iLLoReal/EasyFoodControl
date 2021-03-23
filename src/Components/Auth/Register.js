import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants';
import RegisterApiCalls from '../Api/RegisterApiCalls';

const Register = () => {
  const [state, dispatch] = useContext(Context);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  let history = useHistory();

  const handlePassword = (e) => {
    setPassword(e.target.value.toString());
  };

  const handleUsername = (e) => {
    setUsername(e.target.value.toString());
  };

  const handleEmail = (e) => {
    setEmail(e.target.value.toString());
  }

  function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

  const confirm = async () => {
    if (!username || !password || !email || !validateEmail(email))
      return;
    const auth = await RegisterApiCalls.registerUser(username, password, email);
    if (auth) {
      console.log('About to send' + JSON.stringify(auth.token));
         dispatch({type: actions.REGISTER, payload: auth.token})
    }
    else {
      console.log("Couldn't register user... Cancelling");
    }
    history.push('/');
  };

  return (
    <div>
      <form>
        <div style={{textAlign: 'left'}}>
          <label>Username : </label>
          <input type='text' placeholder='User name' onChange={handleUsername}/>
        </div>
        <div style={{textAlign: 'left'}}>
          <label>Email : </label>
          <input type='text' placeholder='Email' onChange={handleEmail}/>
        </div>
        <div style={{textAlign: 'left'}}>
          <label>Password : </label>
          <input type='password' placeholder='Password' onChange={handlePassword}/>
        </div>
        {email.length && !validateEmail(email) && (
        <div style={{border: "1px solid black", color: 'red', textAlign: 'center', backgroundColor: 'black'}}>Invalid email format</div>)}
      </form>
      <button onClick={confirm}>confirm</button>
   </div>
  )
};

export default Register;