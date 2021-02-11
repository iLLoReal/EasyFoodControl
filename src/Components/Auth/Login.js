import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store'
import * as actions from '../State/Reducer/Reducer.constants';

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
   <div>
      <div>
         <h2>Please login to benefit fully from this application !</h2>
         <form>
            <input type='username' placeholder='User name' onChange={handleUsername}/>
            <input type='password' placeholder='Password' onChange={handlePassword}/>
            <button onClick={handleLogin}>Login</button>
         </form>
         <button onClick={redirectToRegister}>Not registered yet ? Register</button>
      </div>
      <div>
         <button onClick={createRecipe}>Create anonymous recipe</button>
      </div>
   </div>
  )
};

export default Login;