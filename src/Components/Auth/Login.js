import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store'
import * as actions from '../State/Reducer/Reducer.constants';
import { AsyncStorage } from 'AsyncStorage';

const Login = () => {
   const [state, dispatch] = useContext(Context);
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');

   let history = useHistory();

   const handleLogin = () => {
      const auth = {username: username, password: password, token: 'yes'};
      dispatch({type: actions.LOGIN, payload: auth});
      history.push("/");
   };

   const handlePassword = (e) => {
      setPassword(e.target.value.toString());
    };

    const handleUsername = (e) => {
      setUsername(e.target.value.toString());
    };

   const redirectToRegister = () => {
      history.push('/register');
   };

   const createRecipe = () => {
      history.push('/createRecipe');
   };

   return (
   <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
      <h2>Please concider login in to fully benefit from this application !</h2>
      <form style={{textAlign: 'left'}}>
         <label>Username : </label>
         <div>
            <input type='text' placeholder='User name' onChange={handleUsername}/>
         </div>
         <label>Password : </label>
         <div>
            <input type='password' placeholder='Password' onChange={handlePassword}/>
         </div>
      </form>
      <button style={{width: '100%'}} onClick={handleLogin}>
         Login
      </button>
      <button style={{textAlign: 'center', width: '100%'}} onClick={redirectToRegister}>New ? register</button>
   </div>
  )
};

export default Login;