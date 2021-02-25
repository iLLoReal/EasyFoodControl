import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store';
import * as actions from '../State/Reducer/Reducer.constants';

const Register = () => {
  const [state, dispatch] = useContext(Context);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  let history = useHistory();

  const handlePassword = (e) => {
    setPassword(e.target.value.toString());
  };

  const handleUsername = (e) => {
    setUsername(e.target.value.toString());
  };

  const confirm = () => {
    if (!username || !password)
      return;
    const auth = {username: username, password: password, token: 'yes'};
    //Call register with axios
    //If user exists return error (catch(e) => `user ${username} already exists)
    //Get Token and log user in
    dispatch({type: actions.REGISTER, payload: auth})
    history.push("/");
  };

  return (
    <div>
      <form>
        <label>Username : </label>
        <div style={{textAlign: 'right'}}>
          <input type='username' placeholder='User name' onChange={handleUsername}/>
        </div>
        <label>Password : </label>
        <div style={{textAlign: 'right'}}>
          <input type='password' placeholder='Password' onChange={handlePassword}/>
        </div>
      </form>
      <button onClick={confirm}>confirm</button>
   </div>
  )
};

export default Register;