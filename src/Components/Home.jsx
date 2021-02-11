import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from './Navigation/Nav';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Recipe from './Recipes';

import { Context } from './State/Provider/Store';

const Home = () => {
   const [state, dispatch] = useContext(Context);
   const { auth } = state;
   const location = useLocation();

  const AnonymousContent = () => {
    if (location.pathname === '/register')
      return (<Register />);
    else if (location.pathname === '/createRecipe')
      return (<Recipe/>);
    return (<Login/>);
  }

   return (
   <div>
     {auth.token ? (<Nav/>) : <AnonymousContent/>}
   </div>
  )
};

export default Home;