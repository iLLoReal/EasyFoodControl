import React, {
    useState,
    useContext
   } from 'react';


import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store';
import LoginApiCalls  from '../Api/LoginApiCalls';
import * as actions from '../State/Reducer/Reducer.constants';

const Login = () => {
   const [state, dispatch] = useContext(Context);
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [email, setEmail]= useState('');

   let history = useHistory();

   const initialization = async (token) => {
      const meals = await LoginApiCalls.getMealsData(token);
      const objectives = await LoginApiCalls.getObjectives(token);
      const measurements = await LoginApiCalls.getMeasurements(token);
      const recipes = await LoginApiCalls.getRecipes();
      if (meals === null || objectives === null || measurements === null || recipes === null) {
         return  false;
      }
      console.log('Dispatching...');
      console.log(meals);
      dispatch({type: actions.ADD_MEAL, payload: [...meals]});
      dispatch({type: actions.SET_OBJECTIVES, payload: {...objectives}});
      dispatch({type: actions.SET_MEASUREMENTS, payload: {...measurements}});
      dispatch({type: actions.LOGIN, payload: token});
      return true;
   }

   const handleLogin = async () => {
      const token = await LoginApiCalls.getLoginToken(username, password, email);
      if (token) {
         if (!initialization(token)) {
            console.log('Initialization error, cancelling connection');
            history.push('/');
            return;
         }
        history.push('/AddMeal');
      } else {
        console.log("user not found !");
      }
   };

   const handlePassword = (e) => {
      setPassword(e.target.value.toString());
    };

    const handleEmail = (e) => {
       setEmail(e.target.value.toString());
    }

    const handleUsername = (e) => {
      setUsername(e.target.value.toString());
    };

   const redirectToRegister = () => {
      history.push('/register');
   };

   return (
   <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
      <h2>Please concider login in to fully benefit from this application !</h2>
      <form style={{textAlign: 'left'}}>
         <label>Username : </label>
         <div>
            <input type='text' placeholder='User name' onChange={handleUsername}/>
         </div>
         <label>Email : </label>
         <div>
            <input type='text' placeholder='Email' onChange={handleEmail}/>
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