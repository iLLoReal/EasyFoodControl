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

   const handleLogin = async () => {
     console.log('The madness begins !');
      const token = await LoginApiCalls.getLoginToken(username, password, email);
      if (token) {
        console.log('We have that damn token');
        console.log(token);
        const meals = await LoginApiCalls.getMealsData(token);
        console.log('we right here');
        const objectives = await LoginApiCalls.getObjectives(token);
        const measurements = await LoginApiCalls.getMeasurements(token);
        const recipes = await LoginApiCalls.getRecipes();
        console.log('We are after awaits');
        if (meals === null || objectives === null || measurements === null || recipes === null) {
          console.log('There was an error, cancelling connection');
          console.log(`${meals}`);
          console.log(`${objectives}`);
          console.log(`${measurements}`);
          console.log(`${recipes}`);
          history.push('/');
          return;
        }
        console.log('Dispatching...');
        console.log(meals);
        dispatch({type: actions.ADD_MEAL, payload: [...meals]});
        dispatch({type: actions.SET_OBJECTIVES, payload: {...objectives}});
        dispatch({type: actions.SET_MEASUREMENTS, payload: {...measurements}});
        //dispatch({type: actions.ADD_RECIPE, payload: [...recipes]});
        //dipsatch dates ? depuis objective ?
        //handleSelectDateAuto(objectives, measurements); : IL FAUT FIX CA
        dispatch({type: actions.LOGIN, payload: token});
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