import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Context } from '../State/Provider/Store'
import * as actions from '../State/Reducer/Reducer.constants';

const Login = () => {
   const [state, dispatch] = useContext(Context);
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [email, setEmail]= useState('');
   const loginRoute = 'http://localhost:3000/user/login';
   const getMealsRoute = 'http://localhost:3000/user/getMeals';
   const getRecipesRoute = 'http://localhost:3000/getRecipes';
   const getMeasurementsRoute = 'http://localhost:3000/user/getMeasurements';
   const getObjectivesRoute = 'http://localhost:3000/user/getObjectives';
   

   let history = useHistory();

   const handleLogin = async () => {
      const handleSelectDateAuto = (objectives, measurements) => {
         const newSelectedDate = {
           stage: 'finished',
           startingDate: new Date(),
           endingDate: new Date()
         };
         if (state.selectedDate?.startingDate?.getTime()) {
           newSelectedDate.startingDate = new Date(state.selectedDate.startingDate);
         }
     
         const fullYear = newSelectedDate?.startingDate?.getFullYear();
         const months = newSelectedDate?.startingDate?.getMonth() + ((measurements.weight - objectives.weight) / 2);
         const days = newSelectedDate?.startingDate?.getDate() + ((measurements.weight - objectives.weight) % 2 ? 15 : 0);
     
         newSelectedDate.endingDate = new Date(fullYear, months, days);
         dispatch({type: actions.SET_RANGE, payload: {...newSelectedDate}});
       }
      const getMeasurementsFromApi = async (token) => {
         try {
            const result = await axios.post(
               getMeasurementsRoute, 
               {
                  token: token,
               }
            );
            if (result.data)
               dispatch({type: actions.SET_MEASUREMENTS, payload: {...result.data}});
            return result.data;
         } catch (err) {
            return null;
         }
      }
      const getObjectivesFromApi = async (token) => {
         try {
            const result = await axios.post(
               getObjectivesRoute, 
               {
                  token: token,
               }
            )
            const bufferStartingDate = result.data.startingDate;
            const bufferEndingDate = result.data.endingDate;
            result.data.startingDate = new Date(bufferStartingDate);
            result.data.endingDate = new Date(bufferEndingDate);
            if (result.data) {
               await dispatch({type: actions.SET_OBJECTIVES, payload: {...result.data}});
            }
            return result.data;
         } catch(err) {
            console.log(err);
            return null;
         }

      }
      const getMealsFromApi = async (token) => {
         try {
           const result = await axios.post(
              getMealsRoute,
              {
                 token: token
              }
            );
            for (let i = 0; i < result.data.length; i++) {
               const buffer = result.data[i].day;
               result.data[i].day = new Date(buffer);
            }
            await dispatch({type: actions.ADD_MEAL, payload: [...result.data]});
         }
         catch(error) {
            console.log(error);
         }
       }

      const getRecipesFromApi = async () => {
         try {
           const result = await axios.post(
              getRecipesRoute,
              {
              }
            );
            dispatch({type: actions.ADD_RECIPE, payload: [...result.data]});
         }
         catch(error) {
           console.log(error);
         }
       }
      try {
         const result = await axios.post(
            loginRoute,
            {
               login: username,
               password: password,
               email: email
            });
         const auth = {token: result.data.token};
         await getMealsFromApi(result.data.token);
         const objectives = await getObjectivesFromApi(result.data.token);
         const measurements = await getMeasurementsFromApi(result.data.token);
         if (objectives !== null && measurements !== null) {
            handleSelectDateAuto(objectives, measurements);
         }
         await getRecipesFromApi();
         await dispatch({type: actions.LOGIN, payload: auth});
         history.push('/');
      }
      catch(error) {
          console.log(error);
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